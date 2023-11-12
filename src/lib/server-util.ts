import axios from "axios";
import fs from "fs";

/** download file data using url & save locally */
export const downloadFile = async (fileUrl: string) => {
  const fileName = `/tmp/pdf-${Date.now()}.pdf`;
  const { data } = await axios.get(fileUrl, {
    responseType: "stream",
  });
  // Create a write stream to save the PDF locally
  const writeStream = fs.createWriteStream(fileName);

  // Pipe the response data (stream) to the write stream
  data.pipe(writeStream);

  // Wait for the write stream to finish writing the file
  await new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
  return fileName;
};
