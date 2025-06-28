import React from "react";
import { Skeleton } from "primereact/skeleton";

const NowShowingSkeleton = (num) => {
  const cardNum = Array.from({ length: num.countVal }, (_, index) => index + 1);
  return (
    <div className="row" style={{ width: "100%" }}>
      {cardNum &&
        cardNum?.map((item, idx) => (
          <div className="col-sm-4 col-md-4 col-lg-3" key={idx}>
            <div
              className="card bg-light p-1"
              style={{ width: "100%" }}
            >
              <Skeleton width="100%" height="290px"></Skeleton>
              <Skeleton className="my-2"></Skeleton>
              <div className="d-flex justify-content-between mt-1">
                <Skeleton width="5rem" className="my-1"></Skeleton>
                <Skeleton width="5rem" className="my-1"></Skeleton>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <Skeleton width="6rem" height="2.5rem"></Skeleton>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default NowShowingSkeleton;
