import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const LoginComplete = () => {
  const { isSigned } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(isSigned);
  if (isSigned.status) {
    // 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트
    navigate("/");
  }

  return (
    <div>
      <h1>인증이 필요한 페이지</h1>
      {/* 인증된 사용자에게만 보여지는 컨텐츠 */}
    </div>
  );
};

export default LoginComplete;
