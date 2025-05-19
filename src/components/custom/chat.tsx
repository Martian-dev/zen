"use client";

import { type Message } from "ai";
import { useChat } from "@ai-sdk/react";

import { Message as PreviewMessage } from "~/components/custom/message";
import { useScrollToBottom } from "~/components/custom/use-scroll-to-bottom";

import { ArrowUpIcon } from "./icons";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  // const { messages, handleSubmit, input, handleInputChange, append, isLoading, stop } =
  //   useChat({
  //     id,
  //     body: { id },
  //     initialMessages,
  //     maxSteps: 10,
  //     onFinish: () => {
  //       window.history.replaceState({}, "", `/chat/${id}`);
  //     },
  //   });
  const { messages, input, handleInputChange, handleSubmit } =
    useChat({
      id,
      initialMessages,
      maxSteps: 10,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      }
    });

  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8">
      <div className="flex flex-col items-center justify-between gap-4">
        <div
          ref={messagesContainerRef}
          className="flex h-full w-full flex-col items-center gap-4"
        >
          {messages.map((message) => (
            <PreviewMessage
              key={message.id}
              chatId={id}
              role={message.role}
              content={message.content}
              attachments={message.experimental_attachments}
              toolInvocations={message.toolInvocations}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="min-h-[24px] min-w-[24px] shrink-0"
          />
        </div>

        <div className="relative flex w-full items-center gap-4">
          <Textarea
            placeholder="Send a message..."
            value={input}
            onChange={handleInputChange}
            className="w-[30vw] pr-14 overflow-y-auto text-white resize-none active:border-none focus:border-none"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            className="hover:text-black -translate-x-18 bg-accent-slate-600 m-0.5 h-fit rounded-full p-1.5 text-white"
            type="submit"
            onSubmit={handleSubmit}
            disabled={input.length === 0}
          >
            <ArrowUpIcon size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
