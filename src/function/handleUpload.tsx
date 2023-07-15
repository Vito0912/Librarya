import { ResponseData } from "@/database/models/responseData";
import axios, { AxiosRequestConfig } from "axios";

export default async function uploadMedia(files: File[], setProgress: any): Promise<ResponseData> {
  const options: AxiosRequestConfig = {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent: any) => {
      const percentage = (progressEvent.loaded * 100) / progressEvent.total;
      setProgress(+percentage.toFixed(2));
    },
  };
  
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

    const response = await axios.post("/api/media", formData, options);

    return { data: response.data, statusCode: 200 };
  } catch (error: any) {
    if(error.response) {
      return error.response.data;
    }
  }
  return { error: "An unknown error occurred", statusCode: 500 };
}