import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { RootState } from "../../redux/reducers";

const Loader = () => {
  const loader = useSelector((state: RootState) => state.loader);
  return (
    <div
      className={clsx(
        loader &&
          "position-fixed top-0 bottom-0 left-0 right-0  bg-dark opacity-75 d-flex align-items-center justify-content-center  z-index-50 "
      )}
    >
      {loader && (
        <img
          src="/media/logos/travel-bus-logo.png"
          alt="Loading icon.."
          className="width-5 pulse"
        />
      )}
    </div>
  );
};

export default Loader;
