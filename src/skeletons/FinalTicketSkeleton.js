import React from "react";
import { Skeleton } from "primereact/skeleton";

const FinalTicketSkeleton = () => {
  return (
    <div className="card p-2">
      <div className="d-flex justify-content-between">
        <div className="flex">
          <Skeleton width="10rem" height="230px" className="my-1"></Skeleton>
        </div>
        <div className="flex">
          <Skeleton width="10rem" height="1rem"></Skeleton>
          <Skeleton width="10rem" height="1rem" className="my-5"></Skeleton>
          <Skeleton width="10rem" height="1rem"></Skeleton>
        </div>
        <div className="flex mt-3">
          <Skeleton width="8rem" height="1rem" className="my-1"></Skeleton>
          <Skeleton width="8rem" height="1rem" className="my-2"></Skeleton>
          <Skeleton width="8rem" height="8rem" className="my-3"></Skeleton>
        </div>
      </div>
    </div>
  );
};

export default FinalTicketSkeleton;
