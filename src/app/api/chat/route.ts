// import { type CoreMessage, streamText } from 'ai';
//
// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;
//
// export async function POST(req: Request) {
//   const { messages } = await req.json() as { messages: CoreMessage[], error?: Error };
//
//   const result = streamText({
//     model: google('gemini-2.0-flash'),
//     messages,
//   });
//
//   return result.toDataStreamResponse();
// }

import { google } from '@ai-sdk/google';
import { convertToCoreMessages, type Message, streamText } from "ai";
// import { z } from "zod";
import { auth } from '@clerk/nextjs/server';

import {
  // deleteChatById,
  // getChatById,
  saveChat,
} from "~/server/db/queries";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } = await request.json() as { id: string; messages: Array<Message> };

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages: coreMessages,
    onFinish: async ({ response }) => {
      if (userId) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...response.messages],
            userId: userId,
          });
        } catch (error) {
          console.error("Failed to save chat: ", error);
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}
