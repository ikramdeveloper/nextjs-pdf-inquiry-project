import ChatComponent from "@/components/ChatComponent";
import ChatSidebar from "@/components/ChatSidebar";
import PdfViewer from "@/components/PdfViewer";
import { DrizzleChat } from "@/lib/db/schema";
import { getFileUrl } from "@/lib/storage";
import { fetchChatsByUser } from "@/services/chatServer.service";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

const ChatPage = async ({ params }: Props) => {
  // If user is not authenticated, redirect to sign-in page
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const allChats = await fetchChatsByUser(userId);
  // If user has no chats, redirect to home page
  if (!allChats) {
    return redirect("/");
  }

  const currentChat = allChats.find(
    (chat: DrizzleChat) => chat.id === parseInt(params.id)
  );
  // If no chat matches the params.id chat, redirect to 404 page
  if (!currentChat) {
    return redirect("/404");
  }

  return (
    <div className="flex h-screen">
      {/* <div className="flex w-full maxh-screen"> */}
      {/* Chat Sidebar */}
      <div className="flex-[1] max-w-xs">
        <ChatSidebar
          chatId={parseInt(params.id)}
          chats={allChats}
          isPro={false}
        />
      </div>
      {/* Pdf Viewer */}
      <div className="max-h-screen p-4 flex-[5]">
        <PdfViewer pdfUrl={getFileUrl(currentChat.fileKey)} />
      </div>
      {/* Chat Component */}
      <div className="flex-[3] border-l-4 border-l-slate-200">
        <ChatComponent chatId={parseInt(params.id)} />
      </div>
      {/* </div> */}
    </div>
  );
};

export default ChatPage;
