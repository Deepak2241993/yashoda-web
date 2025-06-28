import React from "react";
import { Skeleton } from "primereact/skeleton";

const FormateSkeleton = () => {
  return (
    <div className="card custom-skeleton mx-1">
      <div className="d-flex justify-content-between">
        <Skeleton width="2%" height="2rem"></Skeleton>
        <Skeleton width="9%" height="2rem"></Skeleton>
        <Skeleton width="9%" height="2rem"></Skeleton>
        <Skeleton width="9%" height="2rem"></Skeleton>
        <Skeleton width="9%" height="2rem"></Skeleton>
        <Skeleton width="9%" height="2rem"></Skeleton>
        <Skeleton width="9%" height="2rem"></Skeleton>
        <Skeleton width="9%" height="2rem"></Skeleton>
        <Skeleton width="9%" height="2rem"></Skeleton>
        <Skeleton width="2%" height="2rem"></Skeleton>
      </div>
    </div>
  );
};

export default FormateSkeleton;
