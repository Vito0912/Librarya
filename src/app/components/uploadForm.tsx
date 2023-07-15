import { useState, ChangeEvent, DragEvent } from 'react';
import { Conversion } from '@/function/utils/helpers/conversion';
import handleUpload from '@/function/handleUpload';

interface FileObject {
  [key: string]: File;
}

interface UploadFormProps {
  toggle: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ toggle }) => {
  const [files, setFiles] = useState<FileObject>({});
  const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);
  const [error, setError] = useState<{ status: boolean; message: string }>({
    status: false,
    message: '',
  });
  const allowedFiles = ['.pdf'];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: FileList | null = event.target.files;
    if (selectedFiles) {
      Array.from(selectedFiles).forEach(addFile);
    }
  };

  const addFile = (file: File): void => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (allowedFiles.includes(`.${fileExtension}`)) {
      const objectURL = URL.createObjectURL(file);
      setFiles((prevFiles) => ({ ...prevFiles, [objectURL]: file }));
      setError({ status: false, message: '' });
    } else {
      setError({ status: true, message: 'File type not allowed' });
    }
  };

  const deleteFile = (objectURL: string): void => {
    const updatedFiles = { ...files };
    delete updatedFiles[objectURL];
    setFiles(updatedFiles);
  };

  const submitFiles = async (): Promise<void> => {
    setError({ status: false, message: '' });
    const filesArray = Object.values(files) as File[];
    const content = await handleUpload(filesArray);
    if (content.error) {
      setError({ status: true, message: content.error });
    } else {
        cancelSelection();
    }
  };

  const cancelSelection = (): void => {
    setFiles({});
    setError({ status: false, message: '' });
    toggle();
  };

  const handleDragEnter = (event: DragEvent<HTMLElement>): void => {
    event.preventDefault();
    setIsDraggedOver(true);
  };

  const handleDragLeave = (): void => {
    setIsDraggedOver(false);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>): void => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLElement>): void => {
    event.preventDefault();
    setIsDraggedOver(false);
    Array.from(event.dataTransfer.files).forEach(addFile);
  };

  return (
    <>
      <style jsx>{`
        body {
          overflow: hidden;
        }
      `}</style>
      <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
        <div className={`bg-neutral-950 bg-opacity-95 absolute inset-0 z-0 ${isDraggedOver ? 'draggedover' : ''}`} />
        <div className="container mx-auto max-w-screen-lg">
          <article
            aria-label="File Upload"
            className="relative flex flex-col shadow-xl rounded-lg bg-gray-900"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnter={handleDragEnter}
          >
            <section className="h-full overflow-auto p-8 w-full h-full flex flex-col">
              <header className="border-dashed border-2 border-gray-400 py-8 flex flex-col justify-center items-center rounded-lg">
                <p className="mb-3 font-semibold text-white-900 flex flex-wrap justify-center">
                  <span>Drag and drop your files anywhere</span>
                </p>
                <input id="hidden-input" type="file" multiple accept={allowedFiles.join(',')} className="hidden" onChange={handleFileChange} />
                <button
                  className="mt-2 rounded-lg px-6 py-3 bg-blue-900 hover:bg-blue-950 focus:shadow-outline focus:outline-none"
                  onClick={() => document.getElementById('hidden-input')?.click()}
                >
                  Upload a file
                </button>
              </header>
              <h1 className="pt-3 pb-3 font-semibold sm:text-lg text-white-900">Selected Files</h1>
              <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
                {Object.keys(files).length === 0 ? (
                  <li id="empty" className="h-full w-full text-center flex flex-col items-center justify-center items-center">
                    <span className="text-small text-gray-500">No files selected</span>
                  </li>
                ) : (
                  Object.entries(files).map(([objectURL, file]) => (
                    <li key={objectURL} id={objectURL} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
                      <article tabIndex={0} className="group w-full h-full rounded-lg focus:outline-none focus:shadow-outline relative bg-gray-800 cursor-pointer relative shadow-sm">
                        {file.type.match('image.*') ? (
                          <img alt="upload preview" className="img-preview hidden w-full h-full sticky object-cover rounded-md bg-fixed" src={objectURL} />
                        ) : null}
                        <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                          <h1 className="flex-1 group-hover:text-blue-600">{file.name}</h1>
                          <div className="flex">
                            <span className="py-1 text-blue-900">

                            <svg className='pointer-events-none fill-current w-4 h-4' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M376.097774 551.170115l173.962054 0 0 34.792411-173.962054 0 0-34.792411Z"/><path d="M376.097774 673.966858l243.546875 0 0 34.792411-243.546875 0 0-34.792411Z"/><path d="M376.097774 429.396677l243.546875 0 0 34.792411-243.546875 0 0-34.792411Z"  /><path d="M799.170418 947.106726 225.645157 947.106726c-29.241998 0-52.213175-24.619724-52.213175-53.861722l-0.815575-764.138554c0-29.259394 22.970154-52.213175 52.213175-52.213175l404.64904 0c12.534478 0 24.704658 4.461615 34.256198 12.551874l170.065304 173.447331c10.741645 8.999978 16.766872 24.594141 16.766872 40.212864l0.815575 591.787184C851.382571 924.161131 828.412416 947.106726 799.170418 947.106726zM224.829582 111.702058c-10.044774 0-18.219967 8.175193-18.219967 18.219967l0.815575 764.138554c0 10.06217 8.175193 18.237363 18.219967 18.237363l573.525262 0c10.044774 0 18.219967-8.175193 18.219967-18.219967l-0.815575-591.787184c0-5.395894-2.353604-10.461259-6.459109-13.93743L640.058584 114.90603c-2.098801-1.674129-6.271844-3.203972-10.579963-3.203972L224.829582 111.702058z"/><path d="M828.399113 307.623239 619.644649 307.623239 619.644649 98.868775 654.43706 98.868775 654.43706 272.830829 828.399113 272.830829Z"/>
                            </svg>

                            </span>
                            <p className="pt-1.5 pl-1 size text-xs text-gray-600">{Conversion.formatSize(file.size)}</p>
                            <button
                              className="delete ml-auto focus:outline-none bg-blue-900 hover:bg-blue-600 p-1 rounded-md text-gray-800"
                              onClick={() => deleteFile(objectURL)}
                            >

                              <svg className="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path className="pointer-events-none" d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                              </svg>

                            </button>
                          </div>
                        </section>
                      </article>
                    </li>
                  ))
                )}
              </ul>
              {error.status && <p className="text-red-500 pt-4 px-8 text-right">{error.message}</p>}
              <footer className={`flex justify-end px-8 ${!error.status && 'pt-4'}`}>
                <button
                  id="cancel"
                  className="mr-3 rounded-lg px-3 py-1 bg-gray-800 hover:bg-gray-900 focus:shadow-outline focus:outline-none"
                  onClick={cancelSelection}
                >
                  Cancel
                </button>
                <button
                  id="submit"
                  className="rounded-lg px-3 py-1 bg-blue-900 hover:bg-blue-950 text-white focus:shadow-outline focus:outline-none"
                  onClick={submitFiles}
                >
                  Upload now
                </button>
              </footer>
            </section>
          </article>
        </div>
      </div>
    </>
  );
};

export default UploadForm;
