import React from "react";
import { TbAlbum, TbAlbumOff, TbEdit, TbTrash } from "react-icons/tb";
import { GetFileRequest } from "../../Request";

const FileList = (props) => {
  const fileDownload = async (fileName) => {
    const fileDown = await GetFileRequest("/storage/" + fileName);
    if (fileDown) {
      const blob = new Blob([fileDown.data]);
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(fileUrl);
    }
  };

  return (
    <div className="mt-6 mx-2 overflow-hidden">
      <table className="w-full">
        <thead className="border-b-2 border-stone-500 text-stone-500">
          <tr>
            <th className="text-left p-1 font-extrabold sm:w-1/2">Name</th>
            <th className="p-1 font-extrabold">Date</th>
            <th className="p-1 font-extrabold">Size</th>
            <th colSpan="2" className="p-1 font-extrabold">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {props.fileInfo.map((file, i) => (
            <tr
              key={i}
              className={`border-b border-stone-200 text-stone-700 ${
                i % 2 === 0 ? "bg-stone-100/50" : "bg-stone-100"
              }`}
            >
              <td
                className="p-2 text-sm font-bold text-left cursor-pointer hover:underline hover:underline-offset-4 break-all"
                onClick={() => fileDownload(file.Name)}
              >
                {file.Name}
              </td>
              <td className="p-2 text-xs text-center">{file.Date}</td>
              <td className="p-2 text-xs text-center">{file.Size}</td>
              <td className="w-px scale-50 bg-stone-200" />
              <td className="flex">
                {file.Name.includes(".zip") ? (
                  <div
                    className="flex justify-center items-center w-1/3 p-3 text-lg text-center text-emerald-500 cursor-pointer"
                    onClick={() => {
                      props.setSelectedFile({
                        Name: file.Name,
                        NewName: file.Name,
                        Action: "Move",
                      });
                      props.setModalState(true);
                    }}
                  >
                    <TbAlbum />
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-1/3 p-3 text-lg text-center text-emerald-200">
                    <TbAlbumOff />
                  </div>
                )}
                <div
                  className="flex justify-center items-center w-1/3  p-3 text-lg text-center text-indigo-500 cursor-pointer"
                  onClick={() => {
                    props.setSelectedFile({
                      Name: file.Name,
                      NewName: file.Name,
                      Action: "Rename",
                    });
                    props.setModalState(true);
                  }}
                >
                  <TbEdit />
                </div>
                <div
                  className="flex justify-center items-center w-1/3 p-3 text-lg text-center text-red-500 cursor-pointer"
                  onClick={() => {
                    props.setSelectedFile({
                      Name: file.Name,
                      NewName: "",
                      Action: "Delete",
                    });
                    props.setModalState(true);
                  }}
                >
                  <TbTrash />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
