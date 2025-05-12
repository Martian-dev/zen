import {
  type CoreMessage,
  // type CoreToolMessage,
  generateId,
  type Message,
  // type ToolInvocation,
} from "ai";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { type Chat } from "~/server/db/schema";
import { randomUUID } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  return randomUUID();
}

// function addToolMessageToChat({
//   toolMessage,
//   messages,
// }: {
//   toolMessage: CoreToolMessage;
//   messages: Array<Message>;
// }): Array<Message> {
//   return messages.map((message) => {
//     if (message.toolInvocations) {
//       return {
//         ...message,
//         toolInvocations: message.toolInvocations.map((toolInvocation) => {
//           const toolResult = toolMessage.content.find(
//             (tool) => tool.toolCallId === toolInvocation.toolCallId,
//           );
//
//           if (toolResult) {
//             return {
//               ...toolInvocation,
//               state: "result",
//               result: toolResult.result,
//             };
//           }
//
//           return toolInvocation;
//         }),
//       };
//     }
//
//     return message;
//   });
// }

export function convertToUIMessages(
  messages: Array<CoreMessage>,
): Array<Message> {
  return messages
    .filter((message) => message.role !== "tool")
    .reduce((chatMessages: Array<Message>, message) => {
      // if (message.role === "tool") {
      //   return addToolMessageToChat({
      //     toolMessage: message,
      //     messages: chatMessages,
      //   });
      // }

      let textContent = "";
      // let toolInvocations: Array<ToolInvocation> = [];

      if (typeof message.content === "string") {
        textContent = message.content;
      } else if (Array.isArray(message.content)) {
        for (const content of message.content) {
          if (content.type === "text") {
            textContent += content.text;
            // } else if (content.type === "tool-call") {
            //   toolInvocations.push({
            //     state: "call",
            //     toolCallId: content.toolCallId,
            //     toolName: content.toolName,
            //     args: content.args,
            //   });
          }
        }
      }

      chatMessages.push({
        id: generateId(),
        role: message.role,
        content: textContent,
        // toolInvocations,
      });

      return chatMessages;
    }, []);
}

export function getTitleFromChat(chat: Chat) {
  const messages = convertToUIMessages(chat.messages as Array<CoreMessage>);
  const firstMessage = messages[0];

  if (!firstMessage) {
    return "Untitled";
  }

  return firstMessage.content;
}
