import React, { useState, useContext } from "react";
import { TbRefresh } from "react-icons/tb";
import { MainContext } from "../main/Main";
import { PutRequest } from "../../Request";

const VideoUpdate = (props) => {
  const { handleToast } = useContext(MainContext);
  const [videoInfo, setVideoInfo] = useState({
    target: props.target,
    title: props.title,
    tag: props.tag,
    date: props.date,
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    const update = await PutRequest(videoInfo, "/api/media/video");
    if (update && update.data.Status === 0)
      handleToast("Success", "Information update succeeded");
    else handleToast("Error", "Information update failed");
    props.render();
    props.setModalState(false);
  };

  if (props.target === "image") {
    return (
      <button
        className="justify-center text-xl text-teal-500 border-2 border-teal-500 p-1 m-2 align-middle rounded-full hover:bg-teal-500 hover:text-white transition duration-300"
        onClick={onSubmit}
      >
        <TbRefresh />
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <img
        src={props.previmg}
        alt=""
        className="w-full h-full object-cover p-3 mb-3 bg-stone-100 border border-stone-200 rounded-xl"
      />
      <div className="flex items-center justify-between py-2">
        <div className="p-2 font-extrabold text-stone-700">TAG</div>
        <input
          type="text"
          value={videoInfo.tag}
          onChange={(e) => setVideoInfo({ ...videoInfo, tag: e.target.value })}
          className="w-full max-w-sm text-stone-700 bg-stone-100 p-2 focus:outline-none rounded-xl border-2 border-stone-200 focus:border-stone-400 "
        />
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="p-2 font-extrabold text-stone-700">DATE</div>
        <input
          type="date"
          value={videoInfo.date}
          onChange={(e) => setVideoInfo({ ...videoInfo, date: e.target.value })}
          className="w-full max-w-sm text-stone-700 bg-stone-100 p-2 rounded-xl border-2 border-stone-200 focus:outline-none focus:border-stone-400"
        />
      </div>
      <div className="flex pt-3 items-center justify-end space-x-2">
        <button
          className="px-4 py-2 mr-3 border-2 font-bold text-stone-400 border-stone-300 hover:text-white hover:bg-stone-500 hover:border-stone-500 rounded-full transition duration-300"
          onClick={() => props.setModalState(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white font-extrabold bg-teal-500 border-2 border-teal-500 hover:border-teal-700 hover:bg-teal-700 rounded-full transition duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default VideoUpdate;
