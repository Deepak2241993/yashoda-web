import React from "react";
import { Skeleton } from "primereact/skeleton";

const CinemaSkeleton = () => {
  return (
    <div>
      <div className="d-flex custom-skeleton p-2 border rounded mt-2">
        <Skeleton width="25%" height="150px"></Skeleton>
          <Skeleton width="25%" height="50px" className="mx-2"></Skeleton>
          <Skeleton width="45%" height="150px"></Skeleton>
      </div>
      <div className="d-flex custom-skeleton p-2 border rounded my-2">
        <Skeleton width="25%" height="150px"></Skeleton>
          <Skeleton width="25%" height="50px" className="mx-2"></Skeleton>
          <Skeleton width="45%" height="150px"></Skeleton>
      </div>
      <div className="d-flex custom-skeleton p-2 border rounded my-2">
        <Skeleton width="25%" height="150px"></Skeleton>
          <Skeleton width="25%" height="50px" className="mx-2"></Skeleton>
          <Skeleton width="45%" height="150px"></Skeleton>
      </div>
    </div>
  );
};

export default CinemaSkeleton;
