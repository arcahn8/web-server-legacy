import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteRequest } from "../Request";

const SignOut = () => {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const signout = await DeleteRequest("/api/auth/sign");
      if (signout) {
        if (signout.data.Status === 0) {
          navigate("/");
        }
        // 쿠키를 못불러오는 문제임
      }
      // 접속 에러 표시해야 함
    })();
  });
  return <div></div>;
};

export default SignOut;
