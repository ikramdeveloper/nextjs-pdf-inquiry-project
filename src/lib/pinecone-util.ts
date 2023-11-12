import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import md5 from "md5";
import { PineconeRecord } from "@pinecone-database/pinecone";
import { PDFPage } from "@/types/chat.type";
import { getEmbeddings } from "./embedding";

const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

/** embed document using open ai embedding */
export const embedDocument = async (doc: Document) => {
  const embeddings = await getEmbeddings(doc.pageContent);
  const hash = md5(doc.pageContent);

  return {
    id: hash,
    values: embeddings,
    metadata: {
      text: doc.metadata.text,
      pageNumber: doc.metadata.pageNumber,
    },
  } as PineconeRecord;
};

/** split a page into multiple docs */
export const prepareDocument = async (page: PDFPage) => {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
};
