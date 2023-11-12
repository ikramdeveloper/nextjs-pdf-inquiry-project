"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Inbox, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createChat } from "@/services/chat.service";
import { CHAT_KEY } from "@/config/constants";

const FileUpload = () => {
  const router = useRouter();
  const { mutate, isLoading } = useMutation({
    mutationFn: (body: { file: File }) => createChat(body.file),
    mutationKey: [CHAT_KEY],
    onSuccess(data) {
      console.log("data", data);
      toast.success("Chat created!");
      router.push(`/chat/${data?.chat_id}`);
    },
    onError(err) {
      toast.error("Error creating chat");
      console.error(err);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (files) => {
      console.log("files", files);
      const selectedFile = files[0];
      if (!selectedFile) {
        toast.error("Only Pdf format is acceptable");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Max file size is 10MB");
        return;
      }

      mutate({ file: selectedFile });
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps()}
        className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col"
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <>
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Uploading Pdf...</p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500 " />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
      {/* <a
        href="https://res.cloudinary.com/djd3h2r1g/image/upload/v1696149447/oabvgml9z1x9jnx8kzgq.pdf"
        target="_blank"
      >
        Download
      </a> */}
    </div>
  );
};

export default FileUpload;
