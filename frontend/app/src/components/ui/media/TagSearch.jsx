import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TbSearch } from "react-icons/tb";

const TagSearch = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {}, [props.typing]);

  const tagSubmit = (event) => {
    if (props.tag !== "") {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("tag", props.tag);
      const newSearch = urlParams.toString();
      props.setTag("");
      props.setTyping(false);
      navigate({
        pathname: location.pathname,
        search: newSearch,
      });
    } else {
      event.preventDefault();
      navigate({
        pathname: location.pathname,
      });
      props.setTyping(false);
    }
  };

  if (props.typing) {
    return (
      <form onSubmit={tagSubmit} className="flex justify-center align-middle">
        <input
          type="text"
          value={props.tag}
          onChange={(e) => props.setTag(e.target.value)}
          className="text-stone-700 font-bold text-sm px-3 py-1 my-2 rounded-full border-2 border-teal-500 focus:outline-teal-700"
        />
        <button
          type="submit"
          className="justify-center align-middle text-xl text-white border-2 border-teal-500 p-1 m-2 rounded-full bg-teal-500 hover:bg-teal-700 hover:border-teal-700 transition duration-300"
        >
          <TbSearch />
        </button>
      </form>
    );
  }
  return (
    <button
      className="justify-center text-xl text-teal-500 border-2 border-teal-500 p-1 m-2 align-middle rounded-full hover:bg-teal-500 hover:text-white transition duration-300"
      onClick={() => props.setTyping(true)}
    >
      <TbSearch />
    </button>
  );
};

export default TagSearch;
