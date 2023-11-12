import { Pinecone, utils as PineconeUtils } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { downloadFile } from "./server-util";
import { PDFPage } from "@/types/chat.type";
import { embedDocument, prepareDocument } from "./pinecone-util";
import { convertToAscii } from "./utils";

let pineconeClient: Pinecone | null = null;

/** return existing pinecone client or create a new one */
export const getPineconeClient = () => {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pineconeClient;
};

/** download & load Pdf file and save into pinecone */
export const loadFileIntoPinecone = async (fileUrl: string) => {
  // download file and save locally
  const fileName = await downloadFile(fileUrl);
  if (!fileName) return;

  // load pdf file and get pages
  const loader = new PDFLoader(fileName);
  const pages = (await loader.load()) as PDFPage[];
  console.log("pages", pages);

  // split pdf into multiple segments/documents
  const documents = await Promise.all(pages.map(prepareDocument));

  // vectorise and embed all documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  console.log("vectors", vectors);

  // upload to pinecone
  const client = getPineconeClient();
  const pineconeIndex = client.index("chat-pdf");
  const namespace = pineconeIndex.namespace(convertToAscii(fileName));
  console.log("inserting vectors into pinecone", namespace);
  const result = await namespace.upsert(vectors);

  console.log("result", result);
  return documents[0];
};
