import React from "react";
import { TbX } from "react-icons/tb";

const Modal = (props) => {
  const { state, setState, title } = props;

  return (
    <div
      className={
        state
          ? "flex items-center bg-black/60 fixed inset-0 z-50 duration-300 transform"
          : "hidden bg-black/60 fixed inset-0 z-50 duration-300 transform"
      }
      onClick={() => {
        setState(false);
      }}
    >
      {state ? (
        <section
          className="w-11/12 max-w-lg rounded-2xl bg-stone-50 mx-auto drop-shadow-lg overflow-hidden duration-300 animate-slide-b-t"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <header className="flex flex-wrap px-1 mx-4 py-3 items-center justify-between border-b border-stone-700/50 text-stone-700">
            <div className="font-extrabold text-lg text-stone-700">{title}</div>
            <button
              className="text-2xl p-1 hover:bg-stone-200 duration-300 rounded-full"
              onClick={() => setState(false)}
            >
              <TbX />
            </button>
          </header>
          <main className="py-4 mx-4">{props.children}</main>
        </section>
      ) : null}
    </div>
  );
};

export default Modal;
