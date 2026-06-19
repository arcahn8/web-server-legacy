import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Paging = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const totalPage = Math.ceil(props.totalItem / 18); // 15 items per page

  // 페이지를 변경하는 함수
  const pageChange = (page) => {
    const urlParams = new URLSearchParams(location.search);
    if (page < 1) {
      urlParams.set("page", 1);
    } else if (page > totalPage) {
      urlParams.set("page", totalPage);
    } else {
      urlParams.set("page", page);
    }
    const newSearch = urlParams.toString();
    navigate({
      pathname: location.pathname,
      search: newSearch,
    });
    props.render();
  };

  // 현재 페이지 주변의 페이지 번호 목록을 생성하는 함수
  const neighborPage = () => {
    const pageNumbers = [];
    const nbrNum = (Math.ceil(props.page / 5) - 1) * 5 + 1;
    for (let i = nbrNum; i <= nbrNum + 4 && i <= totalPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => pageChange(1)}
        className="flex justify-center items-center m-1 p-1.5 w-10 h-10 text-center font-extrabold text-stone-700 rounded-full bg-stone-50 hover:bg-stone-200 duration-300 drop-shadow-md"
      >
        {"<<"}
      </button>
      <button
        onClick={() => pageChange((Math.ceil(props.page / 5) - 1) * 5)}
        className="flex justify-center items-center m-1 p-1.5 w-10 h-10 text-center font-extrabold text-stone-700 rounded-full bg-stone-50 hover:bg-stone-200 duration-300 drop-shadow-md"
      >
        {"<"}
      </button>
      {neighborPage().map((page) => (
        <>
          {page === props.page ? (
            <div
              key={page}
              className="flex justify-center items-center m-1 p-1.5 w-10 h-10 text-center font-extrabold text-stone-700/50 rounded-full bg-stone-100 duration-300 drop-shadow-md"
            >
              {page}
            </div>
          ) : (
            <button
              key={page}
              onClick={() => pageChange(page)}
              className="flex justify-center items-center m-1 p-1.5 w-10 h-10 text-center font-extrabold text-stone-700 rounded-full bg-stone-50 hover:bg-stone-200 duration-300 drop-shadow-md"
            >
              {page}
            </button>
          )}
        </>
      ))}
      <button
        onClick={() => pageChange((Math.ceil(props.page / 5) + 1) * 5 - 4)}
        className="flex justify-center items-center m-1 p-1.5 w-10 h-10 text-center font-extrabold text-stone-700 rounded-full bg-stone-50 hover:bg-stone-200 duration-300 drop-shadow-md"
      >
        {">"}
      </button>
      <button
        onClick={() => pageChange(totalPage)}
        className="flex justify-center items-center m-1 p-1.5 w-10 h-10 text-center font-extrabold text-stone-700 rounded-full bg-stone-50 hover:bg-stone-200 duration-300 drop-shadow-md"
      >
        {">>"}
      </button>
    </div>
  );
};

export default Paging;
