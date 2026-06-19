import React, { useState, useContext } from "react";
import { TbX, TbArrowLeft, TbArrowRight } from "react-icons/tb";
import { MainContext } from "../main/Main";

const GalleryViewer = (props) => {
  const [nav, setNav] = useState(true);
  const [dragX, setDragX] = useState(null);
  const [dragging, setDragging] = useState(false);
  const { handleToast } = useContext(MainContext);

  const prevPage = () => {
    if (props.data.page - 1 > 0) {
      props.setData({
        ...props.data,
        page: props.data.page - 1,
      });
    } else {
      handleToast("Warning", "First of pages");
    }
  };

  const nextPage = () => {
    if (props.data.page + 1 <= props.data.totalPage) {
      props.setData({
        ...props.data,
        page: props.data.page + 1,
      });
    } else {
      handleToast("Warning", "End of pages");
    }
  };

  const handleDrag = (e) => {
    setDragging(true);
    if (dragX === null) {
      return;
    }
    const distance = e.clientX - dragX;
    if (distance > 50) {
      prevPage();
    } else if (distance < -50) {
      nextPage();
    } else {
      setDragging(false);
    }
    setDragX(null);
  };

  const handleSlide = (e) => {
    const distance = e.changedTouches[0].clientX - dragX;
    if (distance > 50) {
      prevPage();
    } else if (distance < -50) {
      nextPage();
    } else {
      setDragging(false);
    }
    setDragX(null);
  };

  return (
    <div
      className={
        props.viewer
          ? "flex items-center bg-black/80 fixed inset-0 duration-300 transform"
          : "hidden bg-black/80 fixed inset-0 duration-300 transform"
      }
    >
      {props.viewer ? (
        <div className="w-full h-full relative">
          <div
            className="flex w-full h-full justify-center items-center"
            onMouseDown={(e) => setDragX(e.clientX)}
            onMouseUp={handleDrag}
            onTouchStart={(e) => setDragX(e.touches[0].clientX)}
            onTouchEnd={handleSlide}
          >
            <div className="mx-auto rounded-xl bg-amber-100 overflow-hidden">
              <img
                src={props.data.imgArray[props.data.page - 1]}
                alt={`pg.${props.data.page}`}
                className="max-w-[96vh-100] max-h-[96vh] object-cover"
                draggable="false"
                onClick={() => {
                  if (dragging === false) setNav((prev) => !prev);
                }}
              />
            </div>
          </div>
          {nav ? (
            <div>
              <div className="absolute top-0 bottom-0 left-0 flex flex-col items-center bg-black/70">
                <div className="flex items-center justify-center w-12 h-12 p-2 text-white font-extrabold border-b border-solid border-slate-400">
                  {props.data.page + "/" + props.data.totalPage}
                </div>
                <button
                  className="h-full text-3xl p-1 text-white"
                  onClick={() => prevPage()}
                >
                  <TbArrowLeft />
                </button>
              </div>

              <div className="absolute top-0 bottom-0 right-0 flex flex-col items-center bg-black/70">
                <button
                  className="text-3xl p-2 text-white border-b border-solid border-slate-400"
                  onClick={() => {
                    props.setViewer(false);
                  }}
                >
                  <TbX />
                </button>
                <button
                  className="h-full text-3xl p-1 text-white"
                  onClick={() => nextPage()}
                >
                  <TbArrowRight />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default GalleryViewer;
