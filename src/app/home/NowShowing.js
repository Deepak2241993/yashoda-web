// 'use client'
// import React, { useContext, useState } from "react";
import { Card } from "primereact/card";
import ReactPlayer from "react-player";
import { Dialog } from "primereact/dialog";
import "./nowshowing.css";
// import { MyContext } from '@/context/ThemeContext';
import Cookies from 'js-cookie';
import Link from "next/link";
import NowShowingSkeleton from "@/skeletons/NowShowingSkeleton";


const NowShowing = (nowShowingData) => {
  const cityName = Cookies.get('city');
  const nowShowingMovieData = nowShowingData?.movieData;
  // const { nowShowingMovieData } = useContext(MyContext);
  // const [mtrailerurl, setMtrailerurl] = useState();
  // const [visible, setVisible] = useState(false);
  // console.log('nowShowingData', nowShowingData)

  const moviewCard = (data) => {
    let url = `/moviesessions/${cityName}/${data.n}/${
      data.id
    }`;
    let url2 = url.replace(/\s/g, "-");
    const header = (
      <>
        {data.rt !== "" ? (
          <span className="launch-movie-cinema">{data.rt}</span>
        ) : (
          ""
        )}

        <span>
        <Link href={url2}>
          <img
            alt={data.n}
            src={data.miv ? data.miv : '/assets/default/vertical-default.png'}
            width={100}
            height={400}
            className="rounded"
          />
           </Link>
        </span>
      </>
    );

    
    const language = data?.mfs;
    let finalLang;
    if (language.length > 2) {
      finalLang = `${language[0]}, ${language[1]} +${language.length - 2} more`;
    } else {
      finalLang = data?.mfs?.toString();
    }

    const gnrs = data?.grs;
    let finalGrs;
    if (gnrs.length > 1) {
      finalGrs = `${gnrs[0]} +${gnrs.length - 1} more`;
    } else {
      finalGrs = data?.grs?.toString();
    }

    const subTitle = () => {
      return (
        <div>
          <div className="movie-action-bread">
            <ul>
              <li>{data.ce} </li>
              <li>
                <span className="n-dots"></span>
                {finalGrs}
                {/* {data.othergenres?.split(",").join(", ")} */}
              </li>
            </ul>
          </div>
          <div className="lang-movie-type">
            <span className="languages-now"> {finalLang}</span>
          </div>
          <div className={data?.mtrailerurl ? "icon-trailer" : "d-none"}>
            <img
              src='/assets/icons/video-icon.png'
              alt=""
              className="img-fluid"
              // onClick={(e) => {
              //   e.stopPropagation();
              //   setMtrailerurl(data?.mtrailerurl);
              //   setVisible(true);
              // }}
            />
          </div>
        </div>
      );
    };
    return (
      <Card
        title={
          <span
            onClick={(e) => {
              e.stopPropagation();
              // navigate(url2);
            }}
          >
            {data.n.length > 22 ? `${data.n.substr(0, 22)}...` : data.n}
          </span>
        }
        subTitle={subTitle}
        header={header}
      ></Card>
    );
  };

  return (
    <div className="my-3">
      <div
        className="container view-container"
        style={{ paddingRight: "0px", paddingLeft: "0px" }}
      >
        <div className="movie-time-tab">
          <div className="d-flex justify-content-center ptb-48 book-reduce">
            <div className="container view-container">
              <div className="now-showing-only-desktop">
                <div className="d-flex justify-content-between align-items-center"></div>
              </div>
              {!nowShowingMovieData ? (
                <NowShowingSkeleton countVal={6} />
              ) : (
                <div className="now-movie">
                  {nowShowingMovieData?.mv?.length > 0 ? (
                    nowShowingMovieData?.mv.map((item) => {
                      return (
                        <div className="now-movies" key={item.id}>
                          <div className="nowshowing-poster-show">
                            {moviewCard(item)}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="nothing-found show-in-mobile-view">
                      {/* <img src={NothingFound} alt="" className="img-fluid" /> */}
                      <h6>No movie found</h6>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* <TabView>
            <TabPanel header="Now Showing">
             
            </TabPanel>
            <TabPanel header="Coming Soon">
              <ComingSoon />
            </TabPanel>
          </TabView> */}
        </div>
      </div>
      {/* <div className="card flex justify-content-center">
        <Dialog
          visible={visible}
          className="tariler-show"
          onHide={() => setVisible(false)}
          draggable={false}
        >
          <ReactPlayer
            controls
            playing={true}
            url={mtrailerurl}
            className="play-trailers"
          />
        </Dialog>
      </div> */}
    </div>
  );
};

export default NowShowing;
