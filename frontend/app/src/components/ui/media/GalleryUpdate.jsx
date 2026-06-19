import React, { useState, useContext } from "react";
import { TbRefresh } from "react-icons/tb";
import { MainContext } from "../main/Main";
import { PutRequest } from "../../Request";
import "./switch.css";
import StarRating from "./StarRating";

const GalleryUpdate = (props) => {
  const { handleToast } = useContext(MainContext);
  const [galleryInfo, setGalleryInfo] = useState({
    action: props.action,
    title: props.title,
    tag: props.tag,
    translated: props.translated,
    author: props.author,
    rating: props.rating,
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    const update = await PutRequest(galleryInfo, "/api/media/gallery");
    if (update && update.data.Status === 0)
      handleToast("Success", "Information update succeeded");
    else handleToast("Error", "Information update failed");
    props.render();
  };
  const starChange = (rating) => {
    setGalleryInfo({ ...galleryInfo, rating: Number(rating) });
  };

  if (props.action === "refresh") {
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
      <table>
        <tbody className="pt-3 text-stone-700">
          <tr className="px-1 py-2 h-12">
            <td className="font-extrabold">Tag</td>
            <td className="px-2">
              <input
                type="text"
                value={galleryInfo.tag}
                onChange={(e) =>
                  setGalleryInfo({ ...galleryInfo, tag: e.target.value })
                }
                className="w-full text-stone-700 bg-stone-100 p-2 font-bold rounded-lg border-2 border-stone-200 focus:outline-stone-400"
              />
            </td>
          </tr>
          <tr className="px-1 py-2 h-12">
            <td className="font-extrabold">Author</td>
            <td className="px-2">
              <input
                type="text"
                value={galleryInfo.author}
                onChange={(e) =>
                  setGalleryInfo({ ...galleryInfo, author: e.target.value })
                }
                className="w-full text-stone-700 bg-stone-100 p-2 font-bold rounded-lg border-2 border-stone-200 focus:outline-stone-400"
              />
            </td>
          </tr>
          <tr className="px-1 py-2 h-12">
            <td className="font-extrabold">Translated</td>
            <td>
              <div className="check_to_switch">
                <input
                  type="checkbox"
                  checked={galleryInfo.translated === 1}
                  onChange={(e) =>
                    setGalleryInfo({
                      ...galleryInfo,
                      translated: e.target.checked ? 1 : 0,
                    })
                  }
                  id="switch"
                />
                <label htmlFor="switch" className="switch_label">
                  <span className="onf_btn"></span>
                </label>
              </div>
            </td>
          </tr>
          <tr className="px-1 py-2 h-12">
            <td className="font-extrabold">Rating</td>
            <td>
              <div className="p-2 text-xl">
                <StarRating
                  action="edit"
                  value={galleryInfo.rating}
                  onChange={starChange}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex flex-1 p-2 items-end justify-end">
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

export default GalleryUpdate;
