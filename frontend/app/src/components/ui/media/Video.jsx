import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbSettings } from "react-icons/tb";
import { AuthContext } from "../../auth/AuthContext";
import { GetRequest } from "../../Request";
import Modal from "../main/Modal";
import VideoUpdate from "./VideoUpdate";
import VideoPlayer from "./VideoPlayer";

const Video = () => {
  const { isSigned } = useContext(AuthContext);
  const [render, setRender] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoInfo, setVideoInfo] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [isView, setIsView] = useState(false);
  const [modalVideoData, setModalVideoData] = useState({
    title: "",
    tag: "",
    date: "",
    previmg: "",
    url: "",
    sub: 0,
  });

  const reRender = () => {
    setRender((prev) => !prev);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isSigned.status === false) {
      navigate(-1);
    }
    (async () => {
      const videoList = await GetRequest("/api/media/video");
      if (videoList && videoList.data) setVideoInfo(videoList.data.VideoInfo);
      else setVideoInfo([]);
      setIsLoaded(true);
    })();
  }, [isSigned, navigate, render]);

  return (
    <div>
      <Modal
        state={modalState}
        setState={setModalState}
        title={modalVideoData.title}
      >
        {isView ? (
          <VideoPlayer url={modalVideoData.url} sub={modalVideoData.sub} />
        ) : (
          <VideoUpdate
            target="info"
            title={modalVideoData.title}
            tag={modalVideoData.tag}
            date={modalVideoData.date}
            previmg={modalVideoData.previmg}
            render={reRender}
            setModalState={setModalState}
          />
        )}
      </Modal>
      <div className="flex flex-wrp border-b border-stone-700/50 m-2 items-center justify-between">
        <h1 className="font-black text-stone-700 text-xl align-middle">
          Media - Video
        </h1>
        <VideoUpdate
          target="image"
          title=""
          tag=""
          date=""
          render={reRender}
          setModalState={setModalState}
        />
      </div>
      {isLoaded ? (
        videoInfo.length > 0 ? (
          <div className="flex flex-wrap m-2 bg-stone-100 border border-stone-200">
            {videoInfo.map((video, i) => {
              return (
                <div
                  key={i}
                  className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-2"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsView(true);
                      setModalVideoData({
                        title: video.Title,
                        tag: video.Tag,
                        date: video.Date,
                        previmg: video.PrevImgPath,
                        url: video.Url,
                        sub: video.Subtitle,
                      });
                      setModalState(true);
                    }}
                    className="relative drop-shadow-md transition-transform duration-300 transform hover:scale-105"
                  >
                    <img
                      src={video.PrevImgPath}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 right-0 p-2 font-bold text-sm bg-black bg-opacity-50 text-white">
                      <div className="flex items-center justify-between">
                        {video.Title}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsView(false);
                            setModalVideoData({
                              title: video.Title,
                              tag: video.Tag,
                              date: video.Date,
                              previmg: video.PrevImgPath,
                              url: video.Url,
                              sub: video.Subtitle,
                            });
                            setModalState(true);
                          }}
                        >
                          <TbSettings className="text-xl" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">{video.Tag}</div>
                        <div className="text-xs">{video.Date}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>Not Found Result...</div>
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Video;
