import React from "react";
import { Skeleton } from "primereact/skeleton";
import { Divider } from "primereact/divider";

const MovieSessionSkeleton = () => {
  return (
   <div>
     <div className="card custom-skeleton p-2 border rounded mt-1">
      <div className="flex justify-content-between">
        <div className="d-flex justify-content-between mt-1">
          <Skeleton width="35%" height="20px"></Skeleton>
          <Skeleton width="15rem" height="1.5rem"></Skeleton>
        </div>
        <Skeleton width="45%" height="15px" className="mt-2"></Skeleton>
      </div>
      <Skeleton width="8rem" height="1rem" className="mt-3"></Skeleton>
      <Divider style={{marginTop:"3px"}}/>
      <div className="d-flex mt-3">
        <Skeleton width="10rem" height="3rem"></Skeleton>
        <Skeleton width="10rem" height="3rem" className="mx-3"></Skeleton>
      </div>
      <Skeleton width="8rem" height="1rem" className="mt-3"></Skeleton>
      <Divider style={{marginTop:"3px"}}/>
      <div className="d-flex mt-3">
        <Skeleton width="10rem" height="3rem"></Skeleton>
        <Skeleton width="10rem" height="3rem" className="mx-3"></Skeleton>
        <Skeleton width="10rem" height="3rem"></Skeleton>
      </div>
    </div>
    <div className="card custom-skeleton p-2 border rounded my-3">
      <div className="flex justify-content-between">
        <div className="d-flex justify-content-between mt-1">
          <Skeleton width="35%" height="20px"></Skeleton>
          <Skeleton width="15rem" height="1.5rem"></Skeleton>
        </div>
        <Skeleton width="45%" height="15px" className="mt-2"></Skeleton>
      </div>
      <Skeleton width="8rem" height="1rem" className="mt-3"></Skeleton>
      <Divider style={{marginTop:"3px"}}/>
      <div className="d-flex mt-3">
        <Skeleton width="10rem" height="3rem"></Skeleton>
        <Skeleton width="10rem" height="3rem" className="mx-3"></Skeleton>
      </div>
      <Skeleton width="8rem" height="1rem" className="mt-3"></Skeleton>
      <Divider style={{marginTop:"3px"}}/>
      <div className="d-flex mt-3">
        <Skeleton width="10rem" height="3rem"></Skeleton>
        <Skeleton width="10rem" height="3rem" className="mx-3"></Skeleton>
        <Skeleton width="10rem" height="3rem"></Skeleton>
      </div>
    </div>
   </div>
  );
};

export default MovieSessionSkeleton;
