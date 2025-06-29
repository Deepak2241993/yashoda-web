"use client";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // carousel css 
import Link from "next/link";
import Cookies from "js-cookie";
import BannerSkeleton from "@/skeletons/home-page/BannerSkeleton";

const Banner = (bnrData) => {
  const bannerDatas = bnrData?.bannerData
  const cityName = Cookies.get("city");
  // console.log('bnrData', bnrData)

  const ticketButton = (data) => {
    if (data?.miv?.length !== 0) {
      let url = `/moviesessions/${cityName}/${data?.n}/${data?.id}`;
      let url2 = url.replace(/\s/g, "-");
      return (
        <>
          <span>
            <Link href={url2}>
              <button className="book-tickets-btn btn-gap text-white bg-red-600 px-3 py-2 rounded">
                Book Tickets
              </button>
            </Link>
          </span>
        </>
      );
    }
  };

  const releaseDateUi = (data) => {
    const date = new Date(data);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  };

  return (
    <React.Fragment>
        <div className="movies-banner-dots">
          <div className="relative w-full h-[430px] overflow-hidden">

            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/assets/default/home_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1f1f34] via-[#1f1f34d6] to-[#1f1f34d6] opacity-90"></div>

            {/* Text Content */}
            <div className="relative z-10 p-6 text-white flex flex-col justify-center h-full">
              <h2 className="text-4xl font-bold mb-2">Yashoda </h2>
              <p className="text-lg">Healthcare</p>
            </div>
          </div>

        </div>
    </React.Fragment>
  );
};

export default Banner;
