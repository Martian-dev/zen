import ChatInterface from "~/components/custom/chat-interface";
import { generateUUID } from "~/lib/utils";

export default function HomePage() {
  const id = generateUUID();

  return (
    <main className="dark min-h-screen flex flex-col"> {/* removed items-center justify-center */}
      <ChatInterface key={id} id={id} initialMessages={[]} />
    </main>
  );
}
