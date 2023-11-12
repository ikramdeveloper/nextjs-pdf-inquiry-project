import { openAi } from "./openai-api";

/** get embeddings for a text using open ai */
export const getEmbeddings = async (text: string) => {
  const res = await openAi.createEmbedding({
    model: "text-embedding-ada-002",
    input: text.replace(/\n/g, " "),
  });
  const result = await res.json();
  console.log("result", result);
  return result.data[0].embedding as number[];
};
