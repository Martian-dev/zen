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
    <div className="bg-background flex flex-row justify-center pb-4 md:pb-8">
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

        <form className="sticky bottom-8 bg-muted rounded-lg flex w-full h-full flex-row items-center justify-center gap-2 py-1 px-4">
          {/*<div className="relative flex w-full flex-col gap-4">*/}
          <Textarea
            placeholder="Send a message..."
            value={input}
            onChange={handleInputChange}
            className="bg-muted w-full max-w-md text-[#f1f1f1] p-2 resize-none overflow-y-clip rounded-lg border-none text-base"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            className="hover:text-black bg-accent-slate-600 m-0.5 h-fit rounded-full p-1.5 text-white"
            type="submit"
            onSubmit={handleSubmit}
            disabled={input.length === 0}
          >
            <ArrowUpIcon size={14} />
          </Button>
          {/*</div>*/}
        </form>
      </div>
    </div>
  );
}
