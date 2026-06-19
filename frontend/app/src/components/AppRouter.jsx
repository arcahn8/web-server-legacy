import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import Main from "./ui/main/Main";
import Home from "./ui/Home";
import SignIn from "./auth/SignIn";
import SignOut from "./auth/SignOut";
import LoginCheck from "./auth/LoginComplete";
import Storage from "./ui/storage/Storage";
import Gallery from "./ui/media/Gallery";
import GalleryDetail from "./ui/media/GalleryDetail";
import Video from "./ui/media/Video";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Main>
          <Routes>
            <Route index element={<Home />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signout" element={<SignOut />} />
            <Route path="check" element={<LoginCheck />} />
            <Route path="storage" element={<Storage />} />
            <Route path="media/video" element={<Video />} />
            <Route path="media/gallery" element={<Gallery />} />
            <Route path="media/gallery/detail" element={<GalleryDetail />} />
            {/* </Route> */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Main>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
