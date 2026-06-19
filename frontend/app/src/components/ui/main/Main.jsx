import React, {
  useEffect,
  useCallback,
  useContext,
  useState,
  createContext,
} from "react";
import { useNavigate } from "react-router-dom";
import Authorization from "../../auth/Authorization";
import { AuthContext } from "../../auth/AuthContext";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import Toast from "./Toast";

export const MainContext = createContext();

const Main = ({ children }) => {
  const navigate = useNavigate();
  const { handleSigned } = useContext(AuthContext);
  const [sideBar, setSideBar] = useState(false);
  const [menu, setMenu] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSignedIn = useCallback(async () => {
    const message = await Authorization();
    if (message) {
      handleSigned({ status: true, id: message });
      setMenu({
        user: { name: message, url: "/setting", child: [] },
        menu: [
          { name: "Storage", url: "/storage", child: [] },
          { name: "Reminder", url: "/reminder", child: [] },
          {
            name: "Media",
            url: "/media",
            child: [
              { name: "Gallery", url: "/media/gallery" },
              { name: "Text", url: "media/text" },
              { name: "Video", url: "media/video" },
            ],
          },
        ],
      });
    } else {
      handleSigned({ status: false, id: "" });
      setMenu(null);
    }
  }, [handleSigned]);

  const handleToast = (state, msg) => {
    setToast({ state: state, msg: msg });
  };

  useEffect(() => {
    handleSignedIn();
  }, [navigate, handleSignedIn]);

  return (
    <MainContext.Provider value={{ handleToast }}>
      <NavBar sideBar={sideBar} setSideBar={setSideBar} menu={menu} />
      <SideBar state={sideBar} setState={setSideBar} menu={menu} />
      <div className="mx-2 my-auto p-4 text-sm bg-stone-50 rounded-2xl">
        {children}
      </div>
      {toast ? (
        <Toast state={toast.state} msg={toast.msg} setToast={setToast} />
      ) : null}
    </MainContext.Provider>
  );
};

export default React.memo(Main);
