import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query } = await request.json();

    // Backend call here
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: query }),
    });

    // Check if the response is ok
    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status },
      );
    }

    // Check if response body exists
    if (!response.body) {
      return NextResponse.json(
        { error: "No response body from backend" },
        { status: 500 },
      );
    }

    // Create a TransformStream to properly handle the backend stream
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              controller.close();
              break;
            }

            // Decode the Uint8Array to see what we got
            const rawText = decoder.decode(value, { stream: true });

            // The backend sends structured JSON objects with numeric keys wrapping the actual data
            // Multiple JSON objects may be concatenated, so split them
            const jsonObjects = rawText.split(/(?<=\})(?=\{)/);

            for (const jsonStr of jsonObjects) {
              try {
                const parsed = JSON.parse(jsonStr);

                // If it's an object with numeric keys, convert to actual bytes first
                if (
                  typeof parsed === "object" &&
                  parsed !== null &&
                  "0" in parsed
                ) {
                  // Convert numeric keys to bytes and decode
                  const bytes = new Uint8Array(
                    Object.values(parsed) as number[],
                  );
                  const actualText = decoder.decode(bytes);

                  // Backend already sends SSE format: "data: {...}\n\n"
                  // Strip the "data: " prefix and parse the JSON
                  if (actualText.startsWith("data: ")) {
                    try {
                      const sseJsonStr = actualText.slice(6).trim(); // Remove "data: " prefix
                      const dataObj = JSON.parse(sseJsonStr);

                      // Extract delta from nested structure: {"content": {"delta": "..."}}
                      if (
                        dataObj.content &&
                        dataObj.content.delta &&
                        typeof dataObj.content.delta === "string"
                      ) {
                        // Forward as SSE with just the delta text
                        const sseData = `data: ${JSON.stringify({ content: dataObj.content.delta })}\n\n`;
                        controller.enqueue(encoder.encode(sseData));
                      }
                    } catch (e) {
                      // Ignore parse errors for non-delta chunks
                    }
                  }
                }
              } catch (e) {
                // Ignore parse errors - may be incomplete JSON at chunk boundary
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    // Forward the stream to the client
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
