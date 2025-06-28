import React from "react";
import { Skeleton } from "primereact/skeleton";

const FoodSkeleton = () => {
  const cardNum = Array.from({ length: 8 }, (_, index) => index + 1);

  return (
    <div>
      <div className="d-flex justify-content-between mt-2">
        <Skeleton width="5rem" className="my-1"></Skeleton>
        <Skeleton width="10rem" height="1rem" className="my-1"></Skeleton>
      </div>
      <div className="row mt-2">
        {cardNum &&
          cardNum?.map((item, idx) => (
            <div className="col-lg-3 col-md-6 col-sm-12 my-2" key={idx}>
              <div className="card p-1 shadow">
                <Skeleton width="100%" height="230px"></Skeleton>
                <div className="d-flex justify-content-between mt-1">
                  <Skeleton width="100%" height="1rem"></Skeleton>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <Skeleton
                    width="5rem"
                    height="1rem"
                    className="my-1"
                  ></Skeleton>
                  <Skeleton
                    width="5rem"
                    height="1rem"
                    className="my-1"
                  ></Skeleton>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FoodSkeleton;
