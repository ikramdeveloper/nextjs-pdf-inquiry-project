"use client";

import { CHAT_KEY } from "@/config/constants";
import { fetchMessagesByChat } from "@/services/message.service";
import { useQuery } from "@tanstack/react-query";
import { Loader, Loader2, Send } from "lucide-react";
import MessageList from "./MessageList";
import { useChat } from "ai/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect } from "react";

type Props = {
  chatId: number;
};

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: [CHAT_KEY, chatId],
    queryFn: () => fetchMessagesByChat(chatId),
  });

  const {
    input,
    messages,
    handleInputChange,
    handleSubmit,
    isLoading: isResponseLoading,
  } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data?.messages || [],
  });

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <section className="relative max-h-screen" id="message-container">
      {/* Header */}
      <article className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl-font-bold">Chat</h3>
      </article>

      {/* List Messages */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}
      {!isLoading && !!messages?.length && <MessageList messages={messages} />}

      {isResponseLoading && (
        <div className="sticky bottom-2 ml-4">
          <Loader className="w-6 h-6 animate-spin" />
        </div>
      )}

      <form
        className="sticky bottom-0 inset-x-0 p-2 bg-white"
        onSubmit={handleSubmit}
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            className="w-full"
            placeholder="Ask any question..."
          />
          <Button
            className="bg-blue-600 ml-2"
            disabled={isLoading || isResponseLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ChatComponent;
