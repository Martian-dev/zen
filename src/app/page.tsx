import { Chat } from "~/components/custom/chat";
import { generateUUID } from "~/lib/utils";

export default function HomePage() {
  const id = generateUUID();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0d0c0c] text-black">
      <Chat key={id} id={id} initialMessages={[]} />;
    </main>
  );
}
