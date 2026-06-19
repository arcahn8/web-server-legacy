import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TbEdit, TbDiscountCheckFilled, TbDiscountCheck } from "react-icons/tb";
import { AuthContext } from "../../auth/AuthContext";
import { PostRequest } from "../../Request";
import GalleryUpdate from "./GalleryUpdate";
import StarRating from "./StarRating";
import GalleryViewer from "./GalleryViewer";

const GalleryDetail = () => {
  const { isSigned } = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [galleryDetailInfo, setGalleryDetailInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [render, setRender] = useState(null);
  const [viewer, setViewer] = useState(false);
  const [viewerData, setViewerData] = useState({
    imgArray: [],
    page: 0,
    totalPage: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const targetName = location.state.galleryName;

  const funcEditing = () => {
    setEditing((prev) => !prev);
  };

  const reRender = () => {
    setRender((prev) => !prev);
    funcEditing();
  };

  const changeGalleryPart = (galleryPart, page) => {
    const imgArray = [];
    galleryPart.Pages.map((galleryPage) => imgArray.push(galleryPage.ImgPath));
    setViewerData({
      imgArray: imgArray,
      page: page,
      totalPage: galleryPart.Pages.length,
    });
  };

  useEffect(() => {
    if (isSigned.status === false) {
      navigate(-1);
    }
    (async () => {
      const galleryDetail = await PostRequest(
        { galleryName: targetName },
        "/api/media/gallery"
      );
      if (galleryDetail && galleryDetail.data) {
        setGalleryDetailInfo(galleryDetail.data);
        console.log(galleryDetail.data);
      } else setGalleryDetailInfo(null);
      setIsLoaded(true);
    })();
  }, [isSigned, navigate, targetName, render]);

  return isLoaded ? (
    galleryDetailInfo ? (
      <div>
        <GalleryViewer
          viewer={viewer}
          setViewer={setViewer}
          data={viewerData}
          setData={setViewerData}
        />
        <div className="flex flex-wrap p-2 w-full">
          <img
            src={galleryDetailInfo.PrevImgPath}
            alt="Preview"
            className="max-w-[200px] md:max-w-xs object-cover border border-solid border-stone-500"
          />
          <div className="pl-5 flex-1">
            <div className="flex font-extrabold text-xl md:text-2xl text-stone-700 pb-1 items-center border-b border-stone-700/50 truncate">
              <div className="pr-3 flex-1 align-middle">
                {galleryDetailInfo.Title}
              </div>
              <button
                className="justify-center font-extrabold text-xl text-teal-500 border-2 border-teal-500 p-1 m-1 align-middle rounded-full hover:bg-teal-500 hover:text-white duration-300"
                onClick={funcEditing}
              >
                <TbEdit />
              </button>
            </div>
            {editing ? (
              <GalleryUpdate
                action="edit"
                title={galleryDetailInfo.Title}
                tag={galleryDetailInfo.Tag}
                author={galleryDetailInfo.Author}
                translated={galleryDetailInfo.Translated}
                rating={galleryDetailInfo.Rating}
                render={reRender}
              />
            ) : (
              <table>
                <tbody className="pt-3 text-stone-700">
                  <tr className="px-1 py-2 h-12">
                    <td className="font-extrabold">Tag</td>
                    <td className="p-2 ml-3">{galleryDetailInfo.Tag}</td>
                  </tr>
                  <tr className="px-1 py-2 h-12">
                    <td className="font-extrabold">Author</td>
                    <td className="p-2 ml-3">{galleryDetailInfo.Author}</td>
                  </tr>
                  <tr className="px-1 py-2 h-12">
                    <td className="font-extrabold">Translated</td>
                    <td className="p-2 ml-3 text-3xl">
                      {galleryDetailInfo.Translated === 1 ? (
                        <TbDiscountCheckFilled className="text-amber-400" />
                      ) : (
                        <TbDiscountCheck className="text-gray-400" />
                      )}
                    </td>
                  </tr>
                  <tr className="px-1 py-2 h-12">
                    <td className="font-extrabold">Rating</td>
                    <td className="p-2 ml-3 text-xl">
                      <StarRating
                        action="view"
                        value={galleryDetailInfo.Rating}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="pt-2">
          {galleryDetailInfo.Parts.map((galleryPart, i1) => {
            return (
              <div key={`galleryPart${i1}`} className="mx-2 py-2">
                <div className="font-bold text-lg md:text-xl border-b border-stone-700/50 py-2">
                  {galleryPart.Subtitle}
                </div>
                <div className="flex flex-wrap bg-stone-100 border border-ston-200 my-2 p-1">
                  {galleryPart.Pages.map((galleryPage, i2) => {
                    return (
                      <div
                        key={`gallery${i2}`}
                        className="w-1/4 sm:w-1/5 md:w-1/6 lg:w-[12.5%] xl:w-[10%] p-1"
                      >
                        <img
                          src={galleryPage.ImgPath}
                          alt={galleryPage.Id}
                          className="h-full object-cover border border-stone-300"
                          onClick={() => {
                            changeGalleryPart(galleryPart, i2 + 1);
                            setViewer(true);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <div>Not found result...</div>
    )
  ) : (
    <div>Loading...</div>
  );
};
export default GalleryDetail;
