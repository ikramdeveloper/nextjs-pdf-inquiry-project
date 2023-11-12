import { OpenAIStream, StreamingTextResponse } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import {
  chats as ChatsSchema,
  messages as MessagesSchema,
} from "@/lib/db/schema";
import { createChatModel } from "@/lib/openai-api";

// api/chat

export const POST = async (req: Request) => {
  try {
    const { messages, chatId } = await req.json();
    const chatsResult = await db
      .select()
      .from(ChatsSchema)
      .where(eq(ChatsSchema.id, chatId));

    if (chatsResult.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 400 });
    }
    const fileKey = chatsResult[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);
    const response = await createChatModel(context, messages);

    const stream = OpenAIStream(response, {
      onStart: async () => {
        // save user message in db
        await db.insert(MessagesSchema).values({
          chatId,
          content: lastMessage.content,
          role: "user",
        });
      },
      onCompletion: async (completion) => {
        // save ai message in db
        await db.insert(MessagesSchema).values({
          chatId,
          content: completion,
          role: "system",
        });
      },
    });
    return new StreamingTextResponse(stream);
  } catch (err: any) {
    console.log("server error", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: err.status }
    );
  }
};
