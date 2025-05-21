"use client";

import type React from "react";
import { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { Message as PreviewMessage } from "~/components/custom/message";

import { useChat } from "@ai-sdk/react";

import { useScrollToBottom } from "~/components/custom/use-scroll-to-bottom";

import { type Message } from "ai";

export default function ChatInterface({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const handleInputContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only focus if clicking directly on the container, not on buttons or other interactive elements
    if (
      e.target === e.currentTarget ||
      (e.currentTarget === inputContainerRef.current &&
        !(e.target as HTMLElement).closest("button"))
    ) {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Cmd+Enter on both mobile and desktop
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      handleSubmit();
      return;
    }

    // Only handle regular Enter key (without Shift) on desktop
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id,
    initialMessages,
    maxSteps: 10,
    onFinish: () => {
      window.history.replaceState({}, "", `/chat/${id}`);
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  // Add this effect to reset textarea height when input is cleared
  useEffect(() => {
    if (input === "" && textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }
  }, [input]);

  return (
    <>
      <div
        ref={messagesContainerRef}
        className="w-full flex-grow overflow-y-auto pt-4 pb-32" // removed px-4, added w-full
      >
        <div className="mx-auto max-w-3xl space-y-4 px-4 text-left text-wrap">
          {" "}
          {/* added text-left and px-4 */}
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-background sticky right-0 bottom-0 left-0 p-6 pb-0">
        <form onSubmit={handleSubmit} className="mx-auto w-full md:max-w-3xl">
          <div
            ref={inputContainerRef}
            className={cn("flex w-full cursor-text gap-3 p-3")}
            onClick={handleInputContainerClick}
          >
            <div className="flex-1 py-4">
              <Textarea
                ref={textareaRef}
                placeholder={"Ask Anything"}
                className="max-h-[250px] min-h-[24px] w-full resize-none overflow-x-hidden overflow-y-auto rounded-none border-0 border-b-3 bg-black px-2 py-0 leading-tight text-wrap break-words whitespace-pre-wrap opacity-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (textareaRef.current) {
                    textareaRef.current.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
                onInput={() => {
                  if (textareaRef.current) {
                    textareaRef.current.style.height = "24px"; // reset to min height
                    textareaRef.current.style.height =
                      Math.min(textareaRef.current.scrollHeight, 250) + "px";
                  }
                }}
              />
            </div>

            <div className="flex-none py-4">
              {/*
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn(
                      "rounded-full h-8 w-8 flex-shrink-0 border-gray-200 p-0 transition-colors",
                      activeButton === "add" && "bg-gray-100 border-gray-300",
                    )}
                    onClick={() => toggleButton("add")}
                    disabled={isStreaming}
                  >
                    <Plus className={cn("h-4 w-4", activeButton === "add" && "text-gray-100")} />
                    <span className="sr-only">Add</span>
                  </Button>
                </div>
                */}

              <Button
                type="submit"
                variant="outline"
                size="icon"
                className={cn(
                  "h-6 w-6 flex-shrink-0 scale-110 rounded-full border-0 bg-black transition-all duration-200",
                )}
                disabled={input.length === 0}
              >
                <ArrowUp
                  className={cn("h-4 w-4 text-gray-200 transition-colors")}
                />
                <span className="sr-only">Submit</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
