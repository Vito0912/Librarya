import axios from "axios";

export default async function uploadMedia(files: FileList) {
  try {

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      validFiles.push(file);
    }

    if (!validFiles.length) {
      alert("No valid files were chosen");
      return;
    }


    var formData = new FormData();

    validFiles.forEach((file) => formData.append("file", file));


    console.log(formData);
    const response = await axios.post("/api/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    console.log(error);
    if (error.config && error.config.headers) {
      console.log(error.config.headers);
    }
    
  }
}