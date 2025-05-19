"use client"

import type React from "react"
import { useRef } from "react"
import {
  ArrowUp,
  Menu,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { cn } from "~/lib/utils"

import { Message as PreviewMessage } from "~/components/custom/message";
import { useChat } from "@ai-sdk/react"

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

import { useScrollToBottom } from "~/components/custom/use-scroll-to-bottom";

import { type Message } from "ai";

export default function ChatInterface({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  const handleInputContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only focus if clicking directly on the container, not on buttons or other interactive elements
    if (
      e.target === e.currentTarget ||
      (e.currentTarget === inputContainerRef.current && !(e.target as HTMLElement).closest("button"))
    ) {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Cmd+Enter on both mobile and desktop
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault()
      handleSubmit()
      return
    }

    // Only handle regular Enter key (without Shift) on desktop
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

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
    <div
      className="flex flex-col overflow-hidden h-screen"
    >
      <header className="fixed bg-background top-0 left-0 right-0 h-12 flex items-center px-4 z-20">
        <div className="w-full flex items-center justify-between px-2">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>

          <h1 className="font-medium">Zen</h1>


          <SignedOut>
            <SignInButton>
              <Button className="hover:cursor-pointer" variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <div ref={messagesContainerRef} className="flex-grow pb-32 pt-12 px-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
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

      <div className="fixed bottom-0 left-0 right-0 p-6 pb-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-background">
          <div
            ref={inputContainerRef}
            className={cn(
              "w-full p-3 cursor-text flex gap-3",
            )}
            onClick={handleInputContainerClick}
          >
            <div className="flex-1 py-4">
              <Textarea
                ref={textareaRef}
                placeholder={"Ask Anything"}
                className="min-h-[24px] max-h-[160px] rounded-none w-full border-0 border-b-3 bg-black opacity-100 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-0 resize-none overflow-y-auto leading-tight"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  // Ensure the textarea is scrolled into view when focused
                  if (textareaRef.current) {
                    textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                }}
              />
            </div>

            <div className="py-4 flex-none">
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
                  "rounded-full h-6 w-6 border-0 flex-shrink-0 transition-all duration-200 bg-black scale-110"
                )}
                disabled={input.length === 0}
              >
                <ArrowUp className={cn("h-4 w-4 transition-colors text-gray-200")} />
                <span className="sr-only">Submit</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
