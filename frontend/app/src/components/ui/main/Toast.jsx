import React, { useState, useEffect } from "react";
import {
  TbCircleCheck,
  TbInfoCircle,
  TbAlertCircle,
  TbCircleX,
} from "react-icons/tb";

const Toast = (props) => {
  const [msgs, setMsgs] = useState([]);
  const { state, msg, setToast } = props;

  const msgBody = (state, msg) => {
    let iconColor;
    switch (state) {
      case "Success":
        iconColor = [<TbCircleCheck />, "bg-green-500"];
        break;
      case "Info":
        iconColor = [<TbInfoCircle />, "bg-sky-500"];
        break;
      case "Warning":
        iconColor = [<TbAlertCircle />, "bg-amber-500"];
        break;
      case "Error":
        iconColor = [<TbCircleX />, "bg-red-500"];
        break;
      default:
        iconColor = [null, null];
        break;
    }

    return (
      <div
        key={Date.now()}
        className="flex items-center animate-slide-b-t bg-white my-1 rounded-2xl drop-shadow-md p-1 min-w-60 max-w-4/5"
      >
        <div
          className={`${iconColor[1]} p-2 text-2xl text-white rounded-full my-1 ml-2`}
        >
          {iconColor[0]}
        </div>
        <div className="p-1 mx-2 text-stone-700 ">
          <div className="font-extrabold text-sm">{state}</div>
          <div className="font-base text-xs">{msg}</div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (state) {
      const newMsg = msgBody(state, msg);
      setMsgs((msgs) => {
        const updatedMsgs = [...msgs, newMsg];
        if (updatedMsgs.length > 4) {
          return updatedMsgs.slice(1);
        }
        return updatedMsgs;
      });

      setTimeout(() => {
        setMsgs((msgs) => msgs.filter((m) => m !== newMsg));
      }, 3500);

      setToast({ state: "", msg: "" });
    }
  }, [state, msg, setToast]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center fixed bottom-0 my-3">
        {msgs}
      </div>
    </div>
  );
};

export default Toast;
