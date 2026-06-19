import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TbX,
  TbUser,
  TbSettings,
  TbLogin,
  TbLogout,
  TbHome,
  TbServer2,
  TbNote,
  TbInbox,
  TbChevronUp,
  TbChevronDown,
  TbChevronRight,
  TbSlideshow,
  TbMovie,
  TbBook2,
} from "react-icons/tb";

const SideBar = (props) => {
  const [mediaExp, setMediaExp] = useState(false);
  const sideIcon = [<TbServer2 />, <TbNote />, <TbInbox />];
  const mediaIcon = [<TbSlideshow />, <TbBook2 />, <TbMovie />];

  return (
    <div
      className={
        props.state
          ? "bg-black/25 flex items-start justify-end fixed inset-0 z-50 duration-300 transform"
          : "hidden fixed inset-0 z-50"
      }
      onClick={() => {
        setMediaExp(false);
        props.setState(false);
      }}
    >
      {props.state ? (
        <>
          <div
            className="p-2 my-10 rounded-full backdrop-blur-sm bg-white/70 hover:bg-white/80 drop-shadow-lg text-teal-900 text-2xl hover:text-teal-500 duration-300 transform cursor-pointer"
            onClick={() => {
              setMediaExp(false);
              props.setState(false);
            }}
          >
            <TbX />
          </div>
          <div
            className="w-60 rounded-2xl animate-slide-r-l backdrop-blur-sm bg-white/70 m-2 drop-shadow-lg overflow-hidden duration-300 transform"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <header className="flex flex-col py-3 mx-4 items-center border-b border-teal-900/50">
              {props.menu ? (
                <>
                  <div className="p-1 text-teal-900">
                    <div className="flex items-center justify-center mx-1 w-20 h-20 bg-white/40 rounded-full text-4xl">
                      <TbUser />
                    </div>
                    <div className="py-1 text-center mx-2 text-sm font-extrabold">
                      {props.menu.user.name}
                    </div>
                  </div>
                  <div className="flex w-full text-xs text-teal-900 font-extrabold">
                    <Link
                      to={props.menu.user.url}
                      className="flex-1 flex items-center justify-center py-2 bg-white/20 border border-white/50 rounded-full mx-1 hover:bg-white/30 hover:text-teal-500 duration-300"
                      onClick={() => {
                        setMediaExp(false);
                        props.setState(false);
                      }}
                    >
                      <div className="text-base">
                        <TbSettings />
                      </div>
                      <div className="px-1">Setting</div>
                    </Link>
                    <Link
                      to="signout"
                      className="flex-1 flex items-center justify-center py-2 bg-white/20 border border-white/50 rounded-full mx-1 hover:bg-white/30 hover:text-teal-500 duration-300"
                      onClick={() => {
                        setMediaExp(false);
                        props.setState(false);
                      }}
                    >
                      <div className="text-base">
                        <TbLogout />
                      </div>
                      <div className="px-1">Logout</div>
                    </Link>
                  </div>
                </>
              ) : (
                <Link
                  to="signin"
                  className="p-1 text-teal-900 hover:text-teal-500 duration-300 transform  cursor-pointer"
                  onClick={() => {
                    setMediaExp(false);
                    props.setState(false);
                  }}
                >
                  <div className="flex items-center justify-center mx-1 w-20 h-20 bg-white/40 rounded-full text-4xl">
                    <TbLogin />
                  </div>
                  <div className="py-1 text-center mx-2 text-sm font-extrabold">
                    login
                  </div>
                </Link>
              )}
            </header>
            <div className="py-4 mx-4 flex flex-col">
              <Link
                to="/"
                className="flex items-center py-1 hover:bg-white/30
                hover:border hover:border-white/40 text-teal-900 hover:text-teal-500 rounded-xl duration-200 hover:scale-105"
              >
                <div className="flex items-center justify-center mx-1 w-10 h-10 bg-white/20 border border-white/30 rounded-full text-xl">
                  <TbHome />
                </div>
                <div className="px-1 text-sm font-extrabold">Home</div>
              </Link>
              {props.menu ? (
                <>
                  {props.menu.menu.map((menu, i) =>
                    menu.child.length > 0 ? (
                      <div key={`parent-${menu}-${i}`}>
                        <div
                          className="flex items-center py-1 my-1 hover:bg-white/30
                          hover:border hover:border-white/40 hover:scale-105 text-teal-900 hover:text-teal-500 rounded-xl duration-200 cursor-pointer"
                          onClick={() => setMediaExp((prev) => !prev)}
                        >
                          <div className="flex items-center justify-center mx-1 w-10 h-10 bg-white/20 border border-white/30 rounded-full text-xl">
                            {sideIcon[i]}
                          </div>
                          <div className="px-1 text-sm font-extrabold">
                            {menu.name}
                          </div>
                          <div className="ml-auto text-xl p-2">
                            {mediaExp ? <TbChevronUp /> : <TbChevronDown />}
                          </div>
                        </div>
                        <div
                          className={`${
                            mediaExp ? null : "hidden"
                          } animate-slide-t-b`}
                        >
                          {menu.child.map((childMenu, j) => (
                            <Link
                              key={`child-${childMenu}-${j}`}
                              to={childMenu.url}
                              className="flex items-center py-0.5 my-0.5 hover:bg-white/30
                              hover:border hover:border-white/40 hover:scale-105 text-teal-900 hover:text-teal-500 rounded-lg duration-200"
                            >
                              <div className="pl-4 pr-1">
                                <TbChevronRight />
                              </div>
                              <div className="flex items-center justify-center w-8 h-8 mx-2 bg-white/20 border border-white/30 rounded-full text-lg">
                                {mediaIcon[j]}
                              </div>
                              <div className="px-1 text-xs font-extrabold">
                                {childMenu.name}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={`menu-${menu}-${i}`}
                        to={menu.url}
                        className="flex items-center py-1 my-1 hover:bg-white/30
                        hover:border hover:border-white/40 hover:scale-105 text-teal-900 hover:text-teal-500 rounded-xl duration-200"
                        onClick={() => {
                          setMediaExp(false);
                          props.setState(false);
                        }}
                      >
                        <div className="flex items-center justify-center mx-1 w-10 h-10 bg-white/20 border border-white/30 rounded-full text-xl">
                          {sideIcon[i]}
                        </div>
                        <div className="px-1 text-sm font-extrabold">
                          {menu.name}
                        </div>
                      </Link>
                    )
                  )}
                </>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SideBar;
