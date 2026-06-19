import React, { useContext } from "react";
import { MainContext } from "./main/Main";
import { Link } from "react-router-dom";

const Home = () => {
  const { handleToast } = useContext(MainContext);

  return (
    <div>
      <h1>My Home</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/signin">Signin</Link>
          </li>
          <li>
            <Link to="/auth">Auth</Link>
          </li>
          <li>
            <Link to="/check">check</Link>
          </li>
          <div className="m-5 bg-yellow-500 text-blue-500 font-bold">test</div>
          <button
            onClick={() => {
              handleToast("Success", "TEST MESSAGE");
            }}
          >
            sucTEST
          </button>
          <button
            onClick={() => {
              handleToast("Warning", "TEST MESSAGE");
            }}
          >
            warn TEST
          </button>
          <button
            onClick={() => {
              handleToast("Info", "TEST MESSAGE");
            }}
          >
            info TEST
          </button>
          <button
            onClick={() => {
              handleToast("Error", "TEST MESSAGE");
            }}
          >
            error TEST
          </button>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
