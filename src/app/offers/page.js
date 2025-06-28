"use client";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/ThemeContext";
import { Card } from "primereact/card";
import Cookies from "js-cookie";
import OfferSkeleton from "@/skeletons/home-page/OfferSkeleton";
import Link from "next/link";
import { postApiService } from "@/utils/api";

const Offers = () => {
  const { isMobile, isCityChanged } = useContext(MyContext);
  const ptValue = isMobile ? "MSITE" : "WEBSITE";
  const cityName = Cookies.get("city");
  const [loading, setLoading] = useState(false);
  const [filterOfferData, setFilterOfferData] = useState(null);

  useEffect(() => {
    getOfferDataService();
  }, [isCityChanged]);

  const getOfferDataService = () => {
    setLoading(true);
    const cityPostData = {};
    postApiService(cityPostData, "v1/offer/list", ptValue, cityName).then(
      (res) => {
        setFilterOfferData(res?.output?.offers);
        // console.log('profile', res.output)
        setLoading(false);
      }
    );
  };

  const offerCard = (data) => {
    const header = (
      <img
        alt=""
        src={
          data?.imageVertical
            ? data?.imageVertical
            : "/assets/default/cinema.png"
        }
        // onError={handleMiHImageError}
        className="rounded offer-photo"
      />
    );
    const footer = (
      <span className="d-flex justify-content-between align-items-center">
        <span className="vail-date text-black">
          <span className="text-muted">Valid till:</span>{" "}
          {dateFormat(data?.validTo)}
        </span>
        <Link href={`/offer-details/${data?.id}/${Cookies.get("city")}`}>
          <span className="pointer bg-theme-dark1 text-white rounded px-2 py-1">
            Details
          </span>
        </Link>
      </span>
    );

    const subTitle = () => {
      return (
        <div>
          <div>
            <span className="offer-head offer-equal-heigh">
              {data?.vouDesc}
            </span>
          </div>
        </div>
      );
    };
    return <Card subTitle={subTitle} footer={footer} header={header}></Card>;
  };

  const dateFormat = (data) => {
    const date = new Date(data);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  };
  return (
    <section className="ptb-40">
      <div className="container view-container">
        <div className="all-offer-card">
          <div className="now-showing-filter-cinema offer-box">
            {loading ? (
              <OfferSkeleton countVal={8} />
            ) : (
              <div className="row mt-0">
                {filterOfferData &&
                  filterOfferData?.map((item, idxs) => (
                    <div
                      className="col-md-3 col-sm-4 mb-4 col-12 equal-height-box"
                      key={idxs}
                    >
                      {offerCard(item)}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers;
