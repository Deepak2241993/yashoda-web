import React from "react";
import { Skeleton } from "primereact/skeleton";

const SeatLayoutSkeleton = () => {
  const rowArray = Array.from(
    { length: 16 },
    (_, index) => index + 1
  );

  return (
    <div>
      <div className="flex custom-skeleton p-2 border rounded mt-2">
        <Skeleton width="80%" height="10px" className="mx-5"></Skeleton>
      </div>
      {rowArray.map((item, idx) => {
        return (
          <div
            className="d-flex custom-skeleton p-2 border rounded my-2"
            key={idx}
          >
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
            <Skeleton width="3%" height="1rem" className="mx-2"></Skeleton>
            <Skeleton width="3%" height="1rem"></Skeleton>
          </div>
        );
      })}
    </div>
  );
};

export default SeatLayoutSkeleton;
