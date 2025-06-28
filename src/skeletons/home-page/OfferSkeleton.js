import React from "react";
import { Skeleton } from "primereact/skeleton";

const OfferSkeleton = (num) => {
  const cardNum = Array.from({ length: num.countVal }, (_, index) => index + 1);
  // console.log("num", num.countVal, cardNum)
  return (
    <div className="row">
      {cardNum &&
        cardNum?.map((item, idx) => (
          <div className="col-lg-3 col-md-6 col-sm-12" key={idx}>
            <div className="card custom-skeleton p-4 mx-2" >
              <Skeleton width="100%" height="250px"></Skeleton>
              <div>
                <Skeleton width="100%" height="2rem" className="my-2"></Skeleton>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <Skeleton width="70%" height="1rem"></Skeleton>
                <Skeleton width="25%" height="2rem"></Skeleton>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default OfferSkeleton;
