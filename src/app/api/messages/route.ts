import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { chatId } = await req.json();
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));
    return NextResponse.json({ messages: result }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
};
