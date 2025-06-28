import React from "react";
import { Skeleton } from "primereact/skeleton";

const BannerSkeleton = () => {
  return (
    <div className="d-flex justify-content-between" style={{ height: "50vh" }}>
      <div className="flex mx-5 mt-5" style={{ height: "100%" }}>
        <Skeleton width="10rem" height="1rem"></Skeleton>
        <Skeleton width="20rem" height="2rem" className="mt-2"></Skeleton>
        <Skeleton width="10rem" height="1rem" className="my-3"></Skeleton>
        <Skeleton width="20rem" height="1rem"></Skeleton>
        <div className="flex mx-5 mt-5">
          <Skeleton width="8rem" height="3rem" className="mt-3"></Skeleton>
        </div>
      </div>
      <div className="flex mx-5 mt-5">
        <Skeleton width="8rem" height="15rem"></Skeleton>
      </div>
    </div>
  );
};

export default BannerSkeleton;
