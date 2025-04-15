import { FileDropZone } from "@/components";
import { useRef, useState } from "react";
import { createFile } from "@/api/files";
import { ICreateFile } from "@/types";
import { showError } from "@/utils/alerts";
 /* import { useConnectSignalr } from "@/hooks";  */

declare const bootstrap: any;
interface Props {
  folderId: number;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onUploadedFiles: (filesNames: string[]) => void;
}

export const UploadFileManager = ({
  folderId,
  isModalOpen,
  setIsModalOpen,
  onUploadedFiles,
}: Props) => {
  const [isValid, setIsValid] = useState(true);
  const [dropzoneInstance, setdropzoneInstance] = useState<any>({
    dropzone: null,
    uploadId: null,
  });
  const modalRef = useRef<HTMLDivElement>(null);

/*   const  { signalr }  = useSignalr();
 */
  const handleDropzone = (uploadId: string, dropzone?: any) => {
    setdropzoneInstance({ dropzone, uploadId });
  };
  const handleUploadFiles = async () => {
    try {
      setIsValid(true);
      const { uploadId, dropzone } = dropzoneInstance;
      if (dropzone.files.length === 0) {
        setIsValid(false);
        return;
      }

      const file: ICreateFile = { folderId, uploadId };
      await createFile(file);
      onCloseModal();

      onUploadedFiles(dropzone.files.map((file: any) => file.name));
   
    } catch (error) {
      console.error(error);
      showError("Error al cargar los archivos, vuelva a intentalor mas tarde");
    }
  };

  const onCloseModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 500);
    const modal = bootstrap.Modal.getInstance(modalRef.current);
    modal.hide();
  };
 


  return (
    <>
      <div
        ref={modalRef}
        className="modal fade"
        id="uploadFilesModal"
        tabIndex={-1}
        aria-labelledby="uploadFilesModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="uploadFilesModalLabel">
                Cargar archivos
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                {isModalOpen && (
                  <FileDropZone
                    onGetUploadId={handleDropzone}
                    validate={isValid}
                  />
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button
                onClick={onCloseModal}
                type="button"
                className="btn btn-white"
                /*       data-bs-dismiss="modal" */
                aria-label="Close"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary d-flex justify-content-center align-items-center"
                onClick={() => handleUploadFiles()}
              >
                Cargar archivos
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
