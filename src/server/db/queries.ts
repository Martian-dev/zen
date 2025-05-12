// import type { CoreSystemMessage, CoreUserMessage, CoreAssistantMessage, CoreToolMessage } from "ai";
import { db } from ".";
import { chats } from "./schema";

import { eq } from "drizzle-orm";

// export function deleteChatById() { }

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chats).where(eq(chats.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  // messages: (CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage)[];
  messages: any;
  userId: string;
}) {
  try {
    const selectedChats = await db.select().from(chats).where(eq(chats.id, id));

    if (selectedChats.length > 0) {
      return await db
        .update(chats)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chats.id, id));
    }

    return await db.insert(chats).values({
      messages: JSON.stringify(messages),
      id,
      userID: userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}
