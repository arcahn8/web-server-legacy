import React, { useContext } from "react";
import { MainContext } from "../main/Main";
import { PostRequest, PutRequest, DeleteRequest } from "../../Request";

const ConfirmModal = (props) => {
  const { handleToast } = useContext(MainContext);

  const intoMedia = async () => {
    const fileMove = await PutRequest(props.selectedFile, "/media/gallery");
    if (fileMove && fileMove.data.Status === 0) {
      handleToast("Success", props.selectedFile.Name + " move succeeded");
      props.setSelectedFile({ Name: "", NewName: "", Action: "" });
    } else {
      handleToast("Error", props.selectedFile.Name + " move failed");
    }
    props.render();
    props.setModalState(false);
  };

  const fileRename = async (event) => {
    event.preventDefault();
    const fileRename = await PostRequest(props.selectedFile, "/api/storage");
    if (fileRename && fileRename.data.Status === 0) {
      handleToast("Success", props.selectedFile.Name + " rename succeeded");
      props.setSelectedFile({ Name: "", NewName: "", Action: "" });
    } else {
      handleToast("Error", props.selectedFile.Name + " rename failed");
    }
    props.render();
    props.setModalState(false);
  };

  const fileDelete = async (fileName) => {
    const fileDelete = await DeleteRequest("/storage/" + fileName);
    if (fileDelete && fileDelete.data.Status === 0) {
      handleToast("Success", fileName + " delete succeeded");
      props.setSelectedFile({ Name: "", NewName: "", Action: "" });
    } else {
      handleToast("Error", fileName + " delete failed");
    }
    props.render();
    props.setModalState(false);
  };

  switch (props.selectedFile.Action) {
    case "Move":
      return (
        <div className="flex flex-col">
          <div className="p-1">
            Are you sure you want to transfer <b>{props.selectedFile.Name}</b>{" "}
            from storage to Media?
          </div>
          <div className="flex pt-3 items-center justify-end">
            <button
              className="px-4 py-2 mr-3 border-2 font-bold text-stone-400 border-stone-300 hover:text-white hover:bg-stone-500 hover:border-stone-500 rounded-full transition duration-300"
              onClick={() => {
                props.setSelectedFile({ Name: "", NewName: "", Action: "" });
                props.setModalState(false);
              }}
            >
              Cancel
            </button>
            <button
              className="text-white font-extrabold px-4 py-2 border-2 bg-emerald-500 border-emerald-500 hover:border-emerald-700 hover:bg-emerald-700 rounded-full transition duration-300"
              onClick={() => intoMedia(props.selectedFile.Name)}
            >
              Transfer
            </button>
          </div>
        </div>
      );
    case "Rename":
      return (
        <div className="flex flex-col">
          <div className="py-1">Please enter a new name for the item:</div>
          <form onSubmit={fileRename} className="flex flex-col pt-1">
            <input
              type="text"
              value={props.selectedFile.NewName}
              onChange={(e) =>
                props.setSelectedFile({
                  ...props.selectedFile,
                  NewName: e.target.value,
                })
              }
              className="flex-1 bg-transparent p-2 focus:outline-none bg-white border-2 border-indigo-400 rounded-xl"
            />
            <div className="flex pt-3 justify-end">
              <button
                className="px-4 py-2 mr-3 border-2 font-bold text-stone-400 border-stone-300 hover:text-white hover:bg-stone-500 hover:border-stone-500 rounded-full transition duration-300"
                onClick={() => {
                  props.setSelectedFile({ Name: "", NewName: "", Action: "" });
                  props.setModalState(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white font-extrabold px-4 py-2 border-2 bg-indigo-500 border-indigo-500 hover:border-indigo-700 hover:bg-indigo-700 rounded-full transition duration-300"
              >
                Rename
              </button>
            </div>
          </form>
        </div>
      );
    case "Delete":
      return (
        <div className="flex flex-col">
          <div className="p-1">
            Are you sure you want to delete <b>{props.selectedFile.Name}</b>?
          </div>
          <div className="flex pt-3 justify-end">
            <button
              className="px-4 py-2 mr-3 border-2 font-bold text-stone-400 border-stone-300 hover:text-white hover:bg-stone-500 hover:border-stone-500 rounded-full transition duration-300"
              onClick={() => {
                props.setSelectedFile({ Name: "", NewName: "", Action: "" });
                props.setModalState(false);
              }}
            >
              Cancel
            </button>
            <button
              className="text-white font-extrabold px-4 py-2 border-2 bg-red-500 border-red-500 hover:border-red-700 hover:bg-red-700 rounded-full transition duration-300"
              onClick={() => fileDelete(props.selectedFile.Name)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default ConfirmModal;
