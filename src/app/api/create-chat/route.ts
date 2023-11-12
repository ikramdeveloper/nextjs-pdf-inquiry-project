import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadFileIntoPinecone } from "@/lib/pinecone";
import { getFileUrl } from "@/lib/storage";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// api/create-chat

export const POST = async (req: Request, res: Response) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("body", body);
    const { fileKey, fileName } = body;
    const fileUrl = getFileUrl(fileKey);
    await loadFileIntoPinecone(fileUrl);
    const newChat = await db
      .insert(chats)
      .values({
        pdfName: fileName,
        fileKey: fileKey,
        userId,
      })
      .returning({
        id: chats.id,
      });
    return NextResponse.json({ chat_id: newChat[0].id }, { status: 200 });
  } catch (err: any) {
    console.error("server error", err);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
};
