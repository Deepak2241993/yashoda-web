import React from "react";
import { Skeleton } from "primereact/skeleton";

const CinemasessionSkeleton = () => {
  return (
    <div>
      <div className="card custom-skeleton p-2 border rounded mt-1">
        <div className="d-flex border rounded p-2">
          <Skeleton width="5rem" height="7rem"></Skeleton>
          <div className="flex justify-content-between mx-2">
            <Skeleton width="40%" height="20px"></Skeleton>
            <Skeleton width="40rem" height="1rem" className="mt-2"></Skeleton>
            <Skeleton width="15%" height="1rem" className="my-2"></Skeleton>
            <Skeleton width="50%" height="1rem"></Skeleton>
          </div>
        </div>
      </div>
      <div className="card custom-skeleton p-2 border rounded">
        <div className="d-flex border rounded p-2">
          <Skeleton width="5rem" height="7rem"></Skeleton>
          <div className="flex justify-content-between mx-2">
            <Skeleton width="40%" height="20px"></Skeleton>
            <Skeleton width="40rem" height="1rem" className="mt-2"></Skeleton>
            <Skeleton width="15%" height="1rem" className="my-2"></Skeleton>
            <Skeleton width="50%" height="1rem"></Skeleton>
          </div>
        </div>
      </div>
      <div className="card custom-skeleton p-2 border rounded">
        <div className="d-flex border rounded p-2">
          <Skeleton width="5rem" height="7rem"></Skeleton>
          <div className="flex justify-content-between mx-2">
            <Skeleton width="40%" height="20px"></Skeleton>
            <Skeleton width="40rem" height="1rem" className="mt-2"></Skeleton>
            <Skeleton width="15%" height="1rem" className="my-2"></Skeleton>
            <Skeleton width="50%" height="1rem"></Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemasessionSkeleton;
