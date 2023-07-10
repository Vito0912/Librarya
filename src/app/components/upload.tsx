import uploadMedia from '../../function/handleUpload';
import { useEffect, useRef } from "react";

interface uploadProps {
  showUpload: boolean;
}

const Upload: React.FC<uploadProps> = ({ showUpload }) => {

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  };


  const handleDrop: React.ChangeEventHandler<HTMLInputElement> & React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  
    let files: FileList | null = null;
    if (event.type === 'change') {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.files) {
        files = inputElement.files;
      }
    } else {
      const divElement = event.target as HTMLInputElement | HTMLDivElement;
      if (divElement instanceof HTMLInputElement && divElement.files) {
        files = divElement.files;
      } else if (isDragEvent(event) && event.dataTransfer?.files) {
        files = event.dataTransfer.files;
      }
    }
  
    if (files) {
      uploadMedia(files);
    }
  };
  
  function isDragEvent(event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>): event is React.DragEvent<HTMLDivElement> {
    return (event as React.DragEvent<HTMLDivElement>).dataTransfer !== undefined;
  }
  
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  
    handleDrop(event);
  };


  return (
    <>
      {showUpload && (
        <div className="dark-overlay fixed top-0 left-0 w-screen h-screen bg-black opacity-95 z-40" />
      )}
      <div
        id="upload-container"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[70%]"
        style={{ display: showUpload ? "block" : "none" }}
        onDragOver={handleDragOver}
        onDrop={onDrop}
      >
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="upload-label flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" onChange={handleDrop} />
          </label>
        </div>
      </div>
    </>
  );
};

export default Upload;
