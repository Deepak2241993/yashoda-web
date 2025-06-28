import React from "react";
import { Skeleton } from "primereact/skeleton";

const BookingSummarySkeleton = () => {
  return (
    <div>
      <div className="card custom-skeleton p-2 border rounded mt-1">
        <div className="d-flex">
          <Skeleton width="25%" height="8rem"></Skeleton>
          <div className="flex justify-content-between mx-2 w-75">
            <Skeleton width="60%" height="20px"></Skeleton>
            <Skeleton width="80%" height="1rem" className="mt-2"></Skeleton>
            <Skeleton width="70%" height="1rem" className="my-2"></Skeleton>
            <Skeleton width="90%" height="1rem"></Skeleton>
          </div>
        </div>
      </div>
      <div className="card custom-skeleton p-2 border rounded my-2">
        <div className="d-flex">
          <div className="flex justify-content-between mx-2 w-100">
            <Skeleton width="40%" height="10px"></Skeleton>
            <Skeleton width="40%" height="1rem" className="mt-2"></Skeleton>
            <div className="d-flex">
              <Skeleton width="10%" height="2rem" className="my-2"></Skeleton>
              <Skeleton width="10%" height="2rem" className="my-2 mx-2"></Skeleton>
              <Skeleton width="10%" height="2rem" className="my-2"></Skeleton>
            </div>
          </div>
        </div>
      </div>
      <div className="card custom-skeleton p-2 border rounded my-2">
        <div className="d-flex">
          <div className="flex justify-content-between mx-2 w-100">
            <Skeleton width="40%" height="20px"></Skeleton>
            <div className="d-flex justify-content-between">
            <Skeleton width="40%" height="1rem" className="mt-2"></Skeleton>
            <Skeleton width="40%" height="1rem" className="mt-2"></Skeleton>
            </div>
          </div>
        </div>
      </div>
      <div className="card custom-skeleton p-2 border rounded my-2">
        <div className="d-flex">
          <div className="flex justify-content-between mx-2 w-100">
            <Skeleton width="40%" height="20px"></Skeleton>
            <div className="d-flex justify-content-between">
            <Skeleton width="40%" height="1rem" className="mt-2"></Skeleton>
            <Skeleton width="40%" height="1rem" className="mt-2"></Skeleton>
            </div>
          </div>
        </div>
      </div>
      <div className="card custom-skeleton p-2 border rounded my-2">
        <div className="d-flex">
          <div className="flex justify-content-between mx-2 w-100">
            <div className="d-flex justify-content-between">
            <Skeleton width="40%" height="1rem"></Skeleton>
            <Skeleton width="40%" height="1rem"></Skeleton>
            </div>
            <Skeleton width="100%" height="2.5rem" className="mt-2"></Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummarySkeleton;
