import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TbMenu2, TbSlideshow, TbMovie, TbBook2 } from "react-icons/tb";

import lamp from "../../../assets/images/lamp.png";
import "./hamburger.css";

const NavBar = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const navRef = useRef();
  const mediaIcon = [<TbSlideshow />, <TbBook2 />, <TbMovie />];

  return (
    <nav
      className="bg-gradient-to-r from-amber-500 via-lime-500 to-teal-500 rounded-2xl m-2"
      ref={navRef}
    >
      <div className="mx-auto px-2 text-sm text-white font-extrabold">
        <div className="flex justify-between h-14">
          <Link to="/" className="flex items-center px-4">
            <img src={lamp} className="h-14" alt="logo" />
          </Link>

          <div className="flex items-center hidden md:flex">
            {props.menu ? (
              <>
                <Link
                  to={props.menu.user.url}
                  className="mx-2 px-2 py-2 border-y-2 border-transparent hover:border-b-white hover:text-white hover:scale-105 duration-300"
                >
                  {props.menu.user.name}
                </Link>
                {props.menu.menu.map((menu, i) =>
                  menu.child.length > 0 ? (
                    <div
                      key={i}
                      onMouseEnter={() => setDropdown(true)}
                      onMouseLeave={() => setDropdown(false)}
                    >
                      <div className="mx-2 px-2 py-2 border-y-2 border-transparent hover:border-b-white hover:text-white hover:scale-105 duration-300 relative">
                        {menu.name}
                      </div>
                      <div
                        className={`absolute p-2 w-32 -ml-6 z-40 duration-300 ${
                          dropdown ? "animate-slide-t-b" : "hidden"
                        }`}
                      >
                        {menu.child.map((childMenu, j) => (
                          <Link
                            key={`child-${childMenu}-${j}`}
                            to={childMenu.url}
                            className="flex items-center justify-center py-1 my-1 bg-white/80 text-teal-900 hover:bg-white hover:text-teal-500 hover:scale-105 rounded-lg drop-shadow-lg duration-300"
                          >
                            <div className="flex items-center justify-center w-8 h-8 mr-2 bg-white/50 rounded-full text-lg">
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
                      key={i}
                      to={menu.url}
                      className="mx-2 px-2 py-2 border-y-2 border-transparent hover:border-b-white hover:text-white hover:scale-105 duration-300"
                    >
                      {menu.name}
                    </Link>
                  )
                )}
                <Link
                  to="/signout"
                  className="mx-3 px-5 py-1.5 rounded-full text-white hover:text-white hover:bg-white/20 duration-300 shadow-[0_0_8px_2px_rgba(0,0,0,0.2)] shadow-white"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                to="/signin"
                className="mx-3 px-5 py-1.5 rounded-full text-white hover:text-white hover:bg-white/20 duration-300 shadow-[0_0_8px_2px_rgba(0,0,0,0.2)] shadow-white"
              >
                Login
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => props.setSideBar((prev) => !prev)}
              className="mx-3 text-white text-4xl "
            >
              <TbMenu2 />
            </button>
          </div>
        </div>
      </div>
      {/* {props.menu &&
        props.menu.menu(
          <div className="absolute top-full left-0 w-48 bg-white p-2 shadow-md">
            TEST
          </div>
        )} */}
    </nav>
  );
};

export default NavBar;
