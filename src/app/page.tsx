import { Chat } from "~/components/custom/chat";
import ChatInterface from "~/components/custom/chat-interface";
import { generateUUID } from "~/lib/utils";

export default function HomePage() {
  const id = generateUUID();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center dark">
      {/*<Chat key={id} id={id} initialMessages={[]} />*/}
      <ChatInterface />
    </main>
  );
}
