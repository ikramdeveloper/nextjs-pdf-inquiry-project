import axios from "axios";

export const fetchMessagesByChat = async (chatId: number) => {
  const { data } = await axios.post("/api/messages", { chatId });
  return data;
};
