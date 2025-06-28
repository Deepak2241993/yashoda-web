"use client";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card } from "primereact/card";
import NowShowingSkeleton from "@/skeletons/NowShowingSkeleton";
import Banner from "./home/Banner";
import { useRouter } from "next/navigation";
import { MyContext } from "@/context/ThemeContext";
import { postApiService } from "@/utils/api";

export default function Home() {
  const router = useRouter();
  const { isMobile, isCityChanged } = useContext(MyContext);
  const ptValue = isMobile ? "MSITE" : "WEBSITE";
  const cityName = Cookies.get("city");
  const [nowShowingMovieData, setNowShowingMovieData] = useState(null);
  const [nowShowingLoading, setNowShowingLoading] = useState(false);
  const [comingSoonMovieData, setComingSoonMovieData] = useState(null);
  const [comingSoonLoading, setComingSoonLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    nowShowingDataRequest();
    commingSoonDataRequest();
  }, [isCityChanged]);

  const nowShowingDataRequest = async () => {
    setNowShowingLoading(true);
    const postData = {
      city: cityName,
    };
    try {
      const responece = await postApiService(
        postData,
        "v1/booking/content/nowshowing",
        ptValue,
        Cookies.get("city")
      );
      setNowShowingMovieData(responece?.output);
      setNowShowingLoading(false);
    } catch (error) {
      setNowShowingLoading(false);
      console.log("Now Showing Error:", error);
    }
  };

  const commingSoonDataRequest = async () => {
    setComingSoonLoading(true);
    const postData = {
      city: cityName,
      genres: "",
      languages: "",
    };
    try {
      const responece = await postApiService(
        postData,
        "v1/booking/content/comingsoon",
        ptValue,
        Cookies.get("city")
      );
      setComingSoonMovieData(responece?.output);
      setComingSoonLoading(false);
    } catch (error) {
      console.log("Now Showing Error:", error);
      setComingSoonLoading(false);
    }
  };

  const moviewCard = (data) => {
    let url = `/moviesessions/${Cookies.get("city")}/${data.n}/${data.id}`;
    let url2 = url.replace(/\s/g, "-");
    const header = (
      <>
        {data.rt !== "" ? (
          <span className="launch-movie-cinema">{data.rt}</span>
        ) : (
          ""
        )}

        <span onClick={() => router.push(url2)}>
          <img
            alt={data.n}
            src={data.miv ? data.miv : "/assets/default/vertical-default.png"}
            width={100}
            height={400}
            className="rounded"
          />
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

    return (
      <Card
        title={
          <span>
            {data.n.length > 22 ? `${data.n.substr(0, 22)}...` : data.n}
          </span>
        }
        subTitle={
          <div>
            <div className="movie-action-bread">
              <ul>
                <li>{data.ce} </li>
                <li>
                  <span className="n-dots"></span>
                  {finalGrs}
                </li>
              </ul>
            </div>
            <div className="lang-movie-type">
              <span className="languages-now"> {finalLang}</span>
            </div>
            <div className={data?.mtrailerurl ? "icon-trailer" : "d-none"}>
              <img
                src="/assets/icons/video-icon.png"
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
        }
        header={header}
      ></Card>
    );
  };

  return (
    <div>
      <Banner bannerData={nowShowingMovieData?.banners} />
      <div className="container view-container">
        <div className="flex border-lightgray-600 border-b-2">
          <div
            className={
              activeTab === 0
                ? "p-3 font-bold text-black pointer border-red-600 border-b-2"
                : "p-3 pointer"
            }
            onClick={() => setActiveTab(0)}
          >
            Health Checkup Plans
          </div>
          {/* <div
            className={
              activeTab === 1
                ? "p-3 font-bold text-black pointer border-red-600 border-b-2"
                : "p-3 pointer"
            }
            onClick={() => setActiveTab(1)}
          >
            World
          </div> */}
        </div>
        <div className="my-3">
          <div
            className="container view-container"
            style={{ paddingRight: "0px", paddingLeft: "0px" }}
          >
            <div className="movie-time-tab">
              {/* <div className="d-flex justify-content-center ptb-48 book-reduce">
                {activeTab === 0 ? (
                  <div className="container view-container">
                    <div className="now-showing-only-desktop">
                      <div className="d-flex justify-content-between align-items-center"></div>
                    </div>
                    {nowShowingLoading ? (
                      <NowShowingSkeleton countVal={6} />
                    ) : (
                      <div className="now-movie">
                        {nowShowingMovieData?.mv?.length > 0 ? (
                          nowShowingMovieData?.mv?.map((item) => {
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
                            <h6>Movies not found! Please change the city.</h6>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="container view-container">
                    <div className="now-showing-only-desktop">
                      <div className="d-flex justify-content-between align-items-center"></div>
                    </div>
                    {comingSoonLoading ? (
                      <NowShowingSkeleton countVal={6} />
                    ) : (
                      <div className="now-movie">
                        {comingSoonMovieData?.movies?.length > 0 ? (
                          comingSoonMovieData?.movies
                            ?.slice(0, 10)
                            ?.map((item) => {
                              return (
                                <div className="now-movies" key={item.id}>
                                  <div className="nowshowing-poster-show">
                                    {moviewCard(item)}
                                  </div>
                                </div>
                              );
                            })
                        ) : (
                          <div className="nothing-found">
                            <h6>Movies not found! Please change the city.</h6>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
