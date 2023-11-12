import axios from "axios";
import {
  uploadFileToCloudinary,
  uploadFileToStorage,
  uploadToS3,
} from "@/lib/storage";

export const createChat = async (file: File) => {
  const fileKey = file.name.replace(" ", "-");
  await uploadFileToStorage(file, fileKey);
  const { data } = await axios.post("/api/create-chat", {
    fileKey,
    fileName: file.name,
  });
  return data;
};
