import ChatInterface from "@/components/dashboard/chat/chat-interface";

export default async function RepoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    //prefetch documentation and conversations
    <div>
      {/*Docs Page*/}
      <ChatInterface />
    </div>
  );
}
