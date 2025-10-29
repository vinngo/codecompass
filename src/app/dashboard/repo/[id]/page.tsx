import ChatInterface from "@/components/dashboard/chat/chat-interface";

export default async function RepoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      {/*Docs Page*/}
      <ChatInterface />
    </div>
  );
}
