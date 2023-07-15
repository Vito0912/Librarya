import { ResponseData } from "@/database/models/responseData";
import axios from "axios";

export default async function uploadMedia(files: File[]): Promise<ResponseData> {
  try {

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      validFiles.push(file);
    }

    if (!validFiles.length) {
      return { error: "No valid files were chosen", statusCode: 400 };
    }


    var formData = new FormData();

    validFiles.forEach((file) => formData.append("file", file));

    console.log("Uploaded files:", validFiles.length);

    const response = await axios.post("/api/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { data: response.data, statusCode: 200 };
  } catch (error: any) {
    if(error.response) {
      return error.response.data;
    }
  }
  return { error: "An unknown error occurred", statusCode: 500 };
}