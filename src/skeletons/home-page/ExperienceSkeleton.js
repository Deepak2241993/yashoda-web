import React from 'react'
import { Skeleton } from "primereact/skeleton";

const ExperienceSkeleton = (num) => {
    const cardNum = Array.from({ length: num.countVal }, (_, index) => index + 1);
    // console.log("num", num.countVal, cardNum)
    return (
      <div className="row">
        {cardNum &&
          cardNum?.map((item, idx) => (
            <div className="col-lg-3 col-md-6 col-sm-12" key={idx}>
              <div className="card custom-skeleton p-1 mx-1" >
                <Skeleton width="100%" height="270px"></Skeleton>
              </div>
            </div>
          ))}
      </div>
    );
}

export default ExperienceSkeleton