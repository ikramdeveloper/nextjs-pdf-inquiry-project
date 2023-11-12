import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import axios from "axios";

/** s3 config */
const regionName = "us-east-1";
const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

const s3 = new S3({
  region: regionName,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

/** upload file using cloudinary api */
export const uploadFileToCloudinary = async (file: File) => {
  if (!file || !(file instanceof File)) {
    console.error("file not found or invalid", file);
    throw new Error("file not found or invalid");
  }

  const environment = process.env.CLOUDINARY_ENVIRONMENT;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${environment}/auto/upload?upload_preset=${uploadPreset}`,
    formData
  );
  console.log("result", data);
  return data.secure_url;
};

/** upload file to google cloud storage bucket */
export const uploadFileToStorage = async (file: File, fileKey: string) => {
  if (!file || !(file instanceof File)) {
    console.error("file not found or invalid", file);
    return;
  }

  const bucket = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_STORAGE_BUCKET;
  const accessToken = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ACCESS_TOKEN;
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(
    `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?name=uploads/${fileKey}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log("data", data);
  return data.mediaLink;
};

/** upload file temporarily to httpbin to get data form */
export const getFileInDataForm = async (file: File) => {
  if (!file || !(file instanceof File)) {
    console.error("file not found or invalid", file);
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await axios.post("https://httpbin.org/post", formData);

    console.log(data);
    return data?.files?.file;
  } catch (err) {
    console.error("error", err);
  }
};

/** upload file to s3 bucket */
export const uploadToS3 = async (file: File) => {
  const fileKey =
    "uploads/" + Date.now().toString() + "-" + file.name.replace(" ", "-");
  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: file,
  };

  const command = new PutObjectCommand(params);
  const result = await s3.send(command);
  console.log("result", result);
  return {
    fileKey,
    fileName: file.name,
  };
};

export const getFileUrl = (fileKey: string) => {
  // const url = `https://${bucketName}.s3.${regionName}.amazonaws.com/${fileKey}`;
  // return url;
  const bucket = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_STORAGE_BUCKET;
  const url = `https://storage.googleapis.com/${bucket}uploads/${fileKey}`;
  return url;
};
