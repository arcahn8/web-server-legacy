import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { GetRequest } from "../../Request";
import Modal from "../main/Modal";
import DragDrop from "./DragDrop";
import FileList from "./FileList";
import ConfirmModal from "./ConfirmModal";

const Storage = () => {
  const { isSigned } = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fileInfo, setFileInfo] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    Name: "",
    NewName: "",
    Action: "",
  });
  const [render, setRender] = useState(null);
  const navigate = useNavigate();

  const reRender = () => {
    setRender((prev) => !prev);
  };

  useEffect(() => {
    if (isSigned.status === false) {
      navigate("../../");
    }
    (async () => {
      const fileList = await GetRequest("/api/storage");
      if (fileList) {
        if (fileList.data) {
          setFileInfo(fileList.data.FileInfo);
        } else {
          setFileInfo([]);
        }
        setIsLoaded(true);
      }
    })();
  }, [isSigned, navigate, render]);

  return (
    <div>
      <Modal
        state={modalState}
        setState={setModalState}
        title={selectedFile.Name}
      >
        <ConfirmModal
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          render={reRender}
          setModalState={setModalState}
        />
      </Modal>
      <div className="flex flex-wrap border-b border-stone-700/50 m-2 items-center justify-between">
        <h1 className="font-black text-stone-700 text-xl align-middle pb-2">
          Storage
        </h1>
      </div>
      <DragDrop render={reRender} />
      {isLoaded ? (
        fileInfo.length > 0 ? (
          <FileList
            fileInfo={fileInfo}
            render={reRender}
            setModalState={setModalState}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        ) : (
          <div>Not found result...</div>
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Storage;
