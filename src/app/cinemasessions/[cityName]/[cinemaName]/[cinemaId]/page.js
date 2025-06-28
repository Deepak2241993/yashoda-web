"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import * as Constants from "../../../../../constants/index";
import * as appConstants from "../../../../../constants/index";
import CinemasessionSkeleton from "@/skeletons/CinemasessionSkeleton";
import { Dialog } from "primereact/dialog";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import { MyContext } from "@/context/ThemeContext";
import Cookies from "js-cookie";

const CinemasSession = ({ params }) => {
  const router = useRouter();
  const city = params.cityName;
  const cname = params.cinemaName;
  const ccode = params.cinemaId;
  const { isMobile } = useContext(MyContext);
  const [activeTab, setActiveTab] = useState(0);
  const [cinemaDetails, setCinemaDetails] = useState({});
  const [daySessions, setDaySessions] = useState([]);
  const [dys, setDys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cinemaText, setCinemaText] = useState();
  const [filterSessionList, setFilterSessionList] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [seatlayoutUrl, setSeatLayoutUrl] = useState("");
  const [alertTextValue, setAlertTextValue] = useState("");
  const [showMovieAlert, setShowMovieAlert] = useState(false);
  const [alertTextViewMode, setAlertTextViewMode] = useState(0);

  // console.log("filterSessionList", filterSessionList);

  useEffect(() => {
    Cookies.remove("seatLayoutDate");
    Cookies.remove("encrptedCode");
    cinemasSessionRequest("NA");
    if (cname === "qr" && isMobile) {
      Cookies.set("isQR", true);
      Cookies.set("fnb_qr", "false");
      Cookies.set("city", city);
    }
  }, []);

  // === cinema request ==============
  const cinemasSessionRequest = async (date) => {
    setLoading(true);
    const postData = {
      city: Cookies.get("city"),
      cid: ccode,
      lat: Cookies.get("lat") || "0.00",
      lng: Cookies.get("long") || "0.00",
      dated: date,
      qr: Cookies.get("isQR") && isMobile ? "YES" : "NO",
      cineType: "",
      cineTypeQR: "",
    };
    try {
      await axios
        .post(`${Constants.BASE_URL}v1/booking/content/csessions`, postData, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token") || ""}`,
            chain: appConstants.chain,
            city: Cookies.get("city"),
            country: Constants.countryName,
            appVersion: Constants.appVersion,
            platform: Constants.appPlatform,
          },
        })
        .then((resp) => {
          const dt = resp.data;
          if (dt.result === "success") {
            const ndt = dt.output;
            setDaySessions(ndt.cinemaMovieSessions);
            setSelectedMovieId(ndt?.cinemaMovieSessions[0]?.movieRe?.id);
            setFilterSessionList(ndt.cinemaMovieSessions);
            if (date === "NA") {
              setCinemaText(ndt.cinemaRe.alertTxt);
              setDys(ndt.days);
              Cookies.set("seatLayoutDate", ndt.days[0].dt);
              setCinemaDetails(ndt.cinemaRe);
            }
            setLoading(false);
          } else if (dt.result === "error" || dt.result === "dialog") {
            swal({
              text: dt.msg,
              timer: 2000,
              icon: "error",
              buttons: false,
            });
            // setTimeout(() => navigate(-1), 2500);
            router.push(`/cinemas/${city}`);
            setLoading(false);
          }
        })
        .catch((error) => {
          const err = error?.response;
          if (err?.status === 403) {
            // refraceTokenService();
            console.log(
              "Forbidden: You do not have permission to access this resource."
            );
          } else {
            console.log("Error:", error?.message);
          }
          setLoading(false);
        });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="payment-mobile-header show-in-mobile-view">
        <div className="cinema-name">
          <span
            onClick={() => {
              router.push(`/cinemas/${city}`);
            }}
          >
            <img src="/assets/icons/arrow-b.svg" alt="" className="" />{" "}
          </span>
          <span onClick={() => setShowMobileSearch(true)}>
            {cinemaDetails?.name}
          </span>
        </div>
        <div className="search-mobile-cinemas"></div>
      </div>
      <div
        className="imax-experinces"
        style={{
          backgroundImage: `linear-gradient(72deg, rgb(0 0 0 / 85%) 33.14%, rgba(0, 0, 0, 0) 64.41%), url(${
            cinemaDetails?.mih
              ? cinemaDetails?.mih
              : "/assets/default/cinema.png"
          })`,
          backgroundSize: "cover",
          height: "100% !important",
          backgroundRepeat: "no-repeat",
          backdropFilter: "blur(100px)",
        }}
      >
        <div className="container view-container">
          <div className="row">
            <div className="col-md-6">
              <div className="cinema-banner-imax">
                <div className="imax-logo">
                  <h1>{cinemaDetails?.name}</h1>
                </div>
                {cinemaDetails?.address1 && (
                  <h2>
                    {cinemaDetails?.address1 +
                      " " +
                      cinemaDetails?.address2 +
                      " " +
                      cinemaDetails?.address3}
                  </h2>
                )}
                <div className="share">
                  <p>
                    <span className="share-icon"></span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 align-self-end">
              <div className="icon-imax"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="date-fix-moviesession cinema-session-date">
        <div className="container view-container">
          <div className="row">
            <div className="col-lg-12">
              <div className="calnder-current">
                <ul>
                  {dys &&
                    dys?.map((item, index) => (
                      <li key={index} onClick={() => setActiveTab(index)}>
                        <div
                          className={
                            activeTab === index
                              ? "dates-cinema-active"
                              : "dates-inactive"
                          }
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            cinemasSessionRequest(item.dt);
                            Cookies.set("seatLayoutDate", item.dt);
                          }}
                        >
                          <h5>{item.d}</h5>
                          <span
                            className={
                              activeTab === index
                                ? "week-days-active"
                                : "week-days-inactive"
                            }
                          >
                            {item.wd}
                          </span>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="calander-box-show">
          <div className="calnder-divider"></div>
        </div>
      </div>

      <div className="bg-booking">
        <div className="container view-container">
          <div className="row pt-3">
            {loading ? (
              <CinemasessionSkeleton />
            ) : (
              <div className="col-md-12">
                {filterSessionList?.length > 0
                  ? filterSessionList?.map((item, idx) => {
                      return (
                        <div className="cinemas-card-movietime" key={idx}>
                          <div className="row">
                            <div className="col-md-2">
                              <div className="cinema-movie-poster">
                                <img
                                  src={
                                    item.movieRe.miv
                                      ? item.movieRe.miv
                                      : "/assets/default/vertical-default.png"
                                  }
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                            </div>
                            <div className="col-md-10">
                              <div className="cinema-movie-details">
                                <h3>{item?.movieRe?.filmName}</h3>
                                <div className="movie-action">
                                  <ul>
                                    <li>{item?.movieRe?.ce}</li>
                                    <li>{item?.movieRe?.grs?.toString()}</li>
                                    <li>{item?.movieRe?.mfs?.toString()}</li>
                                  </ul>
                                </div>
                                <div className="thriller">
                                  <p>{item?.movieRe?.synopsis}</p>
                                </div>
                                <div className="movietime-slot">
                                  {item?.shows?.map((cItem, cIdx) => {
                                    return (
                                      <div
                                        className="box-slot-moviesession show-spaces pointer"
                                        key={cIdx}
                                        onClick={() => {
                                          Cookies.set(
                                            "encrptedCode",
                                            cItem.encrypted
                                          );
                                          let url2 = `/seatlayout/${encodeURIComponent(
                                            cinemaDetails.name
                                          )}/${encodeURIComponent(
                                            item.n
                                          )}?moviecode=${
                                            cItem.movieId
                                          }&sessionId=${
                                            cItem.sessionId
                                          }&cinemacode=${
                                            cinemaDetails.theatreId
                                          }&screenId=${
                                            cItem.screenId
                                          }&bundleAllowed=false&membersDay=false`;
                                          if (
                                            cItem.status === 1 ||
                                            cItem.status === 2
                                          ) {
                                            setSeatLayoutUrl(url2);
                                            setAlertTextValue({
                                              adultAlert: item?.movieRe?.adult,
                                              cinemaAlertMsg:
                                                cinemaDetails.alertTxt,
                                              showAlertMsg: cItem.alertTxt,
                                            });

                                            if (item?.movieRe?.adult) {
                                              setShowMovieAlert(true);
                                            } else if (cinemaDetails.alertTxt) {
                                              setShowMovieAlert(true);
                                              setAlertTextViewMode(1);
                                            } else if (cItem.alertTxt) {
                                              setShowMovieAlert(true);
                                              setAlertTextViewMode(2);
                                            } else {
                                              router.push(url2);
                                            }

                                            Cookies.set(
                                              "filmId",
                                              item?.movieRe?.id
                                            );
                                            Cookies.set(
                                              "sessionId",
                                              item?.sessionId
                                            );
                                          }
                                        }}
                                      >
                                        <div
                                          className={`time-select ${
                                            cItem.status === 0
                                              ? "seat-color-disable"
                                              : cItem.status === 1
                                              ? "seat-color-green"
                                              : cItem.status === 2
                                              ? "seat-color-yellow"
                                              : "seat-color-red"
                                          }`}
                                        >
                                          <div className="show-details">
                                            <div className="show-times">
                                              <h5>{cItem.showTime}</h5>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : "movie not found"}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="card flex justify-content-center">
        <Dialog
          visible={showMovieAlert}
          showHeader={false}
          showCloseIcon={false}
          className="popup_rate"
          onHide={() => setShowMovieAlert(false)}
        >
          <div className="card py-2 px-3">
            {alertTextValue.adultAlert === true && alertTextViewMode === 0 ? (
              <>
                <div>
                  <p className="adult-terms">
                    This movie has been rated {`'A'`} and is for audiences above the
                    age of 18. Please carry a valid photo ID/age proof to the
                    theater. No refund of tickets once bought.
                  </p>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="reject-terms"
                    onClick={() => {
                      setShowMovieAlert(false);
                      setAlertTextViewMode(0);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="reject-terms"
                    onClick={() => {
                      if (
                        alertTextValue.cinemaAlertMsg ||
                        alertTextValue.showAlertMsg
                      ) {
                        setAlertTextViewMode(1);
                      } else {
                        router.push(seatlayoutUrl);
                      }
                    }}
                  >
                    Accept
                  </button>
                </div>
              </>
            ) : alertTextValue.cinemaAlertMsg && alertTextViewMode === 1 ? (
              <>
                <div>
                  <p className="mt-3">{alertTextValue.cinemaAlertMsg}</p>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="reject-terms"
                    onClick={() => {
                      setShowMovieAlert(false);
                      setAlertTextViewMode(0);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="py-2 px-3 rounded border-0"
                    onClick={() => {
                      if (alertTextValue.showAlertMsg) {
                        setAlertTextViewMode(2);
                      } else {
                        router.push(seatlayoutUrl);
                      }
                    }}
                  >
                    Accept
                  </button>
                </div>
              </>
            ) : alertTextValue.showAlertMsg && alertTextViewMode === 2 ? (
              <>
                <div>
                  <p className="mt-3">{alertTextValue.showAlertMsg}</p>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="reject-terms"
                    onClick={() => {
                      setShowMovieAlert(false);
                      setAlertTextViewMode(0);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="reject-terms"
                    onClick={() => {
                      router.push(seatlayoutUrl);
                    }}
                  >
                    Accept
                  </button>
                </div>
              </>
            ) : (
              () => setShowMovieAlert(false)
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default CinemasSession;
