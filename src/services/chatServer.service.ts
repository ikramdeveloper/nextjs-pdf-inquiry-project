import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const fetchChatsByUser = async (userId: string) => {
  return await db.select().from(chats).where(eq(chats.userId, userId));
};
