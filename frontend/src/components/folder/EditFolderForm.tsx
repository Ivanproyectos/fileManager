import { ButtonSubmit, UserFolderPersmision } from "@/components";
import { IFolderById, IFolderPermission, UpdateFolder } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as folderApi from '@/api/folderApi'
import { getFolderPermission } from '@/api/folderPermission'

interface Props {
  folderId: number | null;
  modalRefEdit: React.RefObject<HTMLDivElement | null >;
  isModalOpen: boolean;
  onSubmit: (data: UpdateFolder) => void;
  onCloseModal?: () => void;
}

export const EditFolderForm = ({
  modalRefEdit, 
  folderId,
  isModalOpen,
  onCloseModal,
  onSubmit,
}: Props) => {
  const [folderPermissions, setFolderPermissions] = useState<
  IFolderPermission[]
>([])
  const [folder, setFolder] = useState<IFolderById | null>(null)
  const [users, setUsers] = useState<IFolderPermission[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeModalButtonRef = useRef<HTMLButtonElement>(null);
 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFolderById>();

  const handleAddUser = (user: IFolderPermission[]) => {
    setUsers(user);
  }

  const handleOnsubmit = async (data: IFolderById) => {

    const request: UpdateFolder = {
      ...data,
      folderPermissions: users,
      deletedFileIds: []
    }
    await onSubmit(request);
    onCloseModal?.();
    closeModalButtonRef.current?.click();
  }


  useEffect(() => {
    if (!folderId) return

    const loadFolder = async () => {
      try {
        const folder = await folderApi.getFolderByIdAsync(folderId)
        const folderPermission = await getFolderPermission(folderId)
        reset(folder);
        debugger;
        setFolderPermissions(folderPermission) 
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    loadFolder()
  }, [folderId])

  return (
    <div
      ref={modalRefEdit}
      className="modal fade"
      id="editFolderModal"
      tabIndex={-1}
      aria-labelledby="editFolderModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="newProjectModalLabel">
              Editar folder{" "}
              <span className="badge bg-soft-primary text-primary ms-2">{folder?.name}</span>
            </h5>
            <button
              onClick={onCloseModal}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(handleOnsubmit)} id="editFodlderForm">
              <div className="mb-4">
                <label htmlFor="nameSubfolder" className="form-label">
                  Folder{" "}
                  <i
                    className="bi-question-circle text-body ms-1"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Displayed on public forums, such as Front."
                  ></i>
                </label>

                <div className="js-form-message">
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""
                      }`}
                    name="name"
                    id="nameSubfolder"
                    placeholder="Ingrese el nombre del folder"
                    aria-label="Ingrese el nombre del folder"
                    required
                    data-msg="Nombre de folder es requerido."
                  />
                  {errors.name && (
                    <span className="invalid-feedback">
                      Nombre del folder es requerido
                    </span>
                  )}
                </div>
              </div>

              {/*End Form */}

              <div className="mb-4">
                <label className="form-label">
                  Descripción{" "}
                  <span className="form-label-secondary">(Optional)</span>
                </label>
                <div className="js-form-message">
                  <textarea
                    {...register("description")}
                    className="form-control"
                    name="description"
                    placeholder="Ingrese una descripción"
                    aria-label="Ingrese una descripción"
                  ></textarea>
                </div>
              </div>
              {/* <div className="mb-4">
                <label className="form-label">Adjuntar archivos</label>
                {isModalOpen && (
                  <FileDropZone
                    validate={true}
                    onGetUploadId={handleDropzone}
                  />
                )}
              </div> */}
              <div className="mb-4">
                <h4 className="mb-3">
                  Miembros del folder
                </h4>
                <UserFolderPersmision
                 key={folder?.id}
                 onUpdateUsers={handleAddUser} 
                 initialUsers={folderPermissions} />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              ref={closeModalButtonRef}
              onClick={onCloseModal}
              type="button"
              className="btn btn-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              Cancelar
            </button>
            {/*  <button
               disabled={!isValid}
               form="newSubFolder"
               type="submit"
               className="btn btn-primary d-flex justify-content-center align-items-center"
             >
               Crear folder 
             </button> */}
            <ButtonSubmit
              title="Guardar cambios"
              formName="editFodlderForm"
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
