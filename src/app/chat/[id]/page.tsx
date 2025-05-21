import type { CoreMessage } from "ai";
import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import ChatInterface from "~/components/custom/chat-interface";
import { getChatById } from "~/server/db/queries";
import type { Chat } from "~/server/db/schema";
import { convertToUIMessages } from "~/lib/utils";
import type { UUID } from "crypto";

export default async function Page({
  params,
}: {
  params: Promise<{ id: UUID }>;
}) {
  const { id } = await params;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    notFound();
  }

  // type casting and converting messages to UI messages
  const chat: Chat = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  };

  const { userId } = await auth();

  if (!userId) {
    return notFound();
  }

  if (userId !== chat.userID) {
    return notFound();
  }

  return <ChatInterface id={chat.id} initialMessages={chat.messages} />;
}
