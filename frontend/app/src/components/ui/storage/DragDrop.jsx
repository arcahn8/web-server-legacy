import React, { useContext, useState, useRef } from "react";
import { MainContext } from "../main/Main";
import { PutRequest } from "../../Request";
import { TbFileUpload, TbUpload } from "react-icons/tb";

const DragDrop = (props) => {
  const [onDragOver, setOnDragOver] = useState(false);
  const { handleToast } = useContext(MainContext);
  const fileRef = useRef(null);

  const fileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    handleToast("Info", file.name + " uploading...");
    const uploadInfo = await PutRequest(formData, "/api/storage");
    if (uploadInfo) handleToast("Success", file.name + " upload succeeded");
    else handleToast("Error", file.name + " upload failed");
    props.render();
  };

  const fileDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setOnDragOver(false);
      await fileUpload(droppedFile);
    }
  };

  const fileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      await fileUpload(selectedFile);
    }
  };

  return (
    <div className="m-2 px-10 py-5 bg-stone-100">
      <div
        className={`p-3 border border-2 border-dashed rounded-xl transition duration-300 ${
          onDragOver ? "border-stone-500 scale-105" : "border-stone-300"
        }`}
        onDrop={fileDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setOnDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setOnDragOver(false);
        }}
        onClick={() => {
          fileRef.current.click();
        }}
      >
        {onDragOver ? (
          <div className="flex flex-col justify-center items-center">
            <div className="p-4 text-4xl text-stone-500 bg-stone-200 rounded-full">
              <TbFileUpload />
            </div>
            <div className="pt-3 text-stone-500 text-center">
              <b>Uploading?</b>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div className="p-4 text-4xl text-stone-500 bg-stone-200 rounded-full">
              <TbUpload />
            </div>
            <div className="pt-3 text-stone-500 text-center">
              Drag & Drop file to <b>Upload</b>
            </div>
          </div>
        )}
        <input
          type="file"
          ref={fileRef}
          onChange={fileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default DragDrop;
