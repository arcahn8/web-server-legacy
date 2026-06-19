import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TbUser, TbLock, TbLogin2, TbHome } from "react-icons/tb";
import { PostRequest } from "../Request";

const SignIn = () => {
  const [userInfo, setUserInfo] = useState({ id: "", pw: "", platform: "" });
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();

    const signIn = await PostRequest(userInfo, "/api/auth/sign");

    if (signIn) {
      if (signIn.data.Status === 0) {
        navigate(-1);
      }
      // 로그인 실패 표시해야 함
    }
    // 접속 에러 표시해야 함
  };

  useEffect(() => {
    const pltfCheck =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (pltfCheck) {
      setUserInfo((userInfo) => ({ ...userInfo, platform: "mobile" }));
    } else {
      setUserInfo((userInfo) => ({ ...userInfo, platform: "desktop" }));
    }
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="absolute flex flex-col items-center justify-center left-0 right-0 top-0 bottom-0 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center justify-center p-10 bg-stone-50 rounded-2xl drop-shadow-xl animate-slide-b-t sm:w-80">
        <div className="p-5 mb-10 font-extrabold text-2xl text-stone-900">
          Sign In
        </div>
        <div className="flex items-center p-1 my-2 rounded-full bg-white text-stone-500 border border-stone-200 hover:shadow-md hover:shadow-stone-300/50 hover:scale-105 duration-300">
          <div className="px-2 text-xl">
            <TbUser />
          </div>
          <input
            type="text"
            value={userInfo.id}
            placeholder="Enter Username"
            onChange={(e) => setUserInfo({ ...userInfo, id: e.target.value })}
            className="font-bold p-1.5 bg-transparent focus:outline-none w-full"
          />
        </div>
        <div className="flex items-center p-1 my-2 rounded-full bg-white text-stone-500 border border-stone-200 hover:shadow-md hover:shadow-stone-300/50 hover:scale-105 duration-300">
          <div className="px-2 text-xl">
            <TbLock />
          </div>
          <input
            type="password"
            value={userInfo.pw}
            placeholder="Enter Password"
            onChange={(e) => setUserInfo({ ...userInfo, pw: e.target.value })}
            className="font-bold p-1.5 bg-transparent focus:outline-none w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-amber-500/90 rounded-full text-white px-14 py-2 my-6 font-black hover:scale-105 duration-300 flex items-center justify-center hover:bg-amber-500/70 hover:shadow-[0_0_8px_2px_rgba(0,0,0,0.2)] hover:shadow-amber-400/50"
        >
          <div className="pr-2 text-2xl">
            <TbLogin2 />
          </div>
          <div className="pr-4">Sign In</div>
        </button>

        <div>
          <Link
            to="/"
            className="flex items-center justify-center px-5 py-3 rounded-xl hover:bg-stone-400/20 border border-transparent hover:border-stone-400/40 duration-300"
          >
            <div className="text-xl pr-2">
              <TbHome />
            </div>
            <div className="font-extrabold pr-2">Home</div>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
