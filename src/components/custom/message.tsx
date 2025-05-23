"use client";

import { type Attachment, type ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";

export const Message = ({
  chatId,
  role,
  content,
}: {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  return (
    <motion.div
      className="flex w-full flex-row justify-center gap-4 px-4 first-of-type:pt-4 md:px-0 md:first-of-type:pt-10" // add justify-center, remove md:w-[500px]
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex size-[24px] shrink-0 flex-col items-center justify-center rounded-sm border p-1 text-zinc-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex w-full flex-col gap-2 text-wrap break-words whitespace-pre-wrap">
        {content && typeof content === "string" && (
          <div className="flex flex-col gap-4 text-zinc-800 dark:text-zinc-300">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};
