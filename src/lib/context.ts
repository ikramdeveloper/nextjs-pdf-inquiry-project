import { getEmbeddings } from "./embedding";
import { getPineconeClient } from "./pinecone";
import { convertToAscii } from "./utils";

type Metadata = {
  text: string;
  pageNumber: number;
};

export const getMatchesFromEmbeddings = async (
  embeddings: number[],
  fileKey: string
) => {
  try {
    const client = getPineconeClient();
    const pineconeIndex = client.index("chat-pdf");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (err) {
    console.log("error querying embeddings", err);
    throw err;
  }
};

export const getContext = async (query: string, fileKey: string) => {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  const docs = qualifyingDocs.map((doc) => (doc.metadata as Metadata).text);

  return docs.join("\n").substring(0, 3000);
};
