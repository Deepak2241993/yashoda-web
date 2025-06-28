import React from "react";
import { Skeleton } from "primereact/skeleton";

const ShowtimeByCinemaSkeleton = () => {
  return (
    <div>
      <div className="card custom-skeleton p-2 border rounded mt-1">
        <div className="flex w-100">
          <div className="d-flex justify-content-between">
            <Skeleton width="20%" height="1rem"></Skeleton>
            <Skeleton width="20%" height="1rem"></Skeleton>
          </div>
          <Skeleton width="15%" height="1rem" className="my-2"></Skeleton>
        </div>
      </div>
      <div className="card custom-skeleton p-2 border rounded my-2">
        <div className="flex w-100">
          <div className="d-flex justify-content-between">
            <Skeleton width="20%" height="1rem"></Skeleton>
            <Skeleton width="20%" height="1rem"></Skeleton>
          </div>
          <Skeleton width="15%" height="1rem" className="my-2"></Skeleton>
        </div>
      </div>
      <div className="card custom-skeleton p-2 border rounded my-2">
        <div className="flex w-100">
          <div className="d-flex justify-content-between">
            <Skeleton width="20%" height="1rem"></Skeleton>
            <Skeleton width="20%" height="1rem"></Skeleton>
          </div>
          <Skeleton width="15%" height="1rem" className="my-2"></Skeleton>
        </div>
      </div>
      <div className="card custom-skeleton p-2 border rounded my-2">
        <div className="flex w-100">
          <div className="d-flex justify-content-between">
            <Skeleton width="20%" height="1rem"></Skeleton>
            <Skeleton width="20%" height="1rem"></Skeleton>
          </div>
          <Skeleton width="15%" height="1rem" className="my-2"></Skeleton>
        </div>
      </div>
      <div className="card custom-skeleton p-2 border rounded my-2">
        <div className="flex w-100">
          <div className="d-flex justify-content-between">
            <Skeleton width="20%" height="1rem"></Skeleton>
            <Skeleton width="20%" height="1rem"></Skeleton>
          </div>
          <Skeleton width="15%" height="1rem" className="my-2"></Skeleton>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeByCinemaSkeleton;
