"use client";
import React, { useState, useContext, useEffect } from "react";
import * as appConstants from "../../../constants/index";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { MyContext } from "@/context/ThemeContext";
import Image from "next/image";
import Cookies from "js-cookie";
import { postApiService } from "@/utils/api";
import ConfirmMessageDialog from "@/global-functions/ConfirmMessageDialog";

const MyBookings = () => {
  const { isMobile } = useContext(MyContext);
  const ptValue = isMobile ? "MSITE" : "WEBSITE";
  const cityName = Cookies.get("city");
  const [visibleRight, setVisibleRight] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [finalTicket, setFinalTicket] = useState(null);
  const [selectedMovieData, setSelectedMovieData] = useState(null);
  const [showTicketCancelInfo, setShowTicketCancelInfo] = useState(false);
  const [pastBooking, setPastBooking] = useState([]);
  const [upcomingBooking, setUpcomingBooking] = useState([]);
  const [loading, setLoading] = useState(false);

  // console.log("finalTicket", finalTicket);

  useEffect(() => {
    getMyBookngsService();
  }, []);

  const getMyBookngsService = () => {
    setLoading(true);
    const cityPostData = {
      orderId: "",
      bookType: "BOOKING",
      cityName: cityName,
      past: false,
    };
    postApiService(cityPostData, "v1/history/orders", ptValue, cityName).then(
      (res) => {
        const ndt = res.output;

        // === current booking rearranged array =========
        const currentBookingTicket = ndt?.c?.filter((item) => {
          return item?.bookType !== "FOOD";
        });
        const currentBookingFood = ndt?.c?.filter((item) => {
          return item?.bookType === "FOOD";
        });
        const currentBookingResult = [];
        currentBookingTicket?.forEach((item1) => {
          currentBookingResult?.push(item1);
          const matchingItems2 = currentBookingFood.filter(
            (item2) => item1.orderIdEx === item2.childBookingId
          );
          currentBookingResult.push(...matchingItems2);
        });
        currentBookingFood?.forEach((item2) => {
          const isMatch = currentBookingTicket.some(
            (item1) => item1.orderIdEx === item2.childBookingId
          );
          if (!isMatch) {
            currentBookingResult.push(item2);
          }
        });
        setUpcomingBooking(currentBookingResult);

        // === past booking rearranged array =========
        const pastBookingTicket = ndt?.p?.filter((item) => {
          return item?.bookType !== "FOOD";
        });
        const pastBookingFood = ndt?.p?.filter((item) => {
          return item?.bookType === "FOOD";
        });
        const pastBookingResult = [];
        pastBookingTicket?.forEach((item1) => {
          pastBookingResult.push(item1);
          const matchingItems2 = pastBookingFood.filter(
            (item2) => item1.orderIdEx === item2.childBookingId
          );
          pastBookingResult.push(...matchingItems2);
        });
        pastBookingFood?.forEach((item2) => {
          const isMatch = pastBookingTicket.some(
            (item1) => item1.orderIdEx === item2.childBookingId
          );
          if (!isMatch) {
            pastBookingResult.push(item2);
          }
        });
        setPastBooking(pastBookingResult);
        setLoading(false);
        // setProfileDetails(res.output);
        // console.log('profile', res.output)
        // setLoading(false);
      }
    );
  };

  const getMovieDetails = (data) => {
    setDetailLoading(true);
    const cityPostData = {
      qr: Cookies.get("isQR") && isMobile ? "YES" : "NO",
      bookType: data.bookType,
      transId: "",
      bookingId: data.bookingId,
      flowType: "HISTORY",
      ccode: data.theaterId,
    };
    try {
      postApiService(
        cityPostData,
        "v1/booking/ticketing/completed",
        ptValue,
        cityName
      ).then((res) => {
        const ndt = res.output;
        setFinalTicket({ type: data.type, data: ndt });
        setVisibleRight(true);
        setDetailLoading(false);
      });
    } catch (error) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2500);
      setErrorMsg("");
      setDetailLoading(false);
    }
  };

  const filmFoodPoster = (item) => {
    let imgUrl;
    if (item?.bookType === "FOOD") {
      imgUrl = "/assets/default/food.svg";
    } else {
      imgUrl = item?.orderFilmCinema?.posterVert
        ? item?.orderFilmCinema?.posterVert
        : "/assets/default/vertical-deafault.png";
    }
    return imgUrl;
  };

  const haldleAddFood = (item) => {
    const url = `/food/${Cookies.get("city")}/${
      item?.orderFilmCinema?.theaterName
    }/${item?.orderFilmCinema?.theaterId}`;

    let url2 = url.replace(/\s/g, "-").toLocaleLowerCase();
    navigate(url2);
    Cookies.set("booking_type", "FOOD");
    Cookies.set("bookingid", item?.orderIdEx);
    Cookies.set("theaterId", item?.orderFilmCinema?.theaterId);
    Cookies.set("transid", "0");
  };

  return (
    <>
      <div>{loading ? "Loading ..." : ""}</div>
      <div className="information-personal">
        <div className="show-booking-profile">
          <div className="now-showing-filter-cinema">
            <div>
              {upcomingBooking.length === 0 && pastBooking.length === 0 ? (
                <div className="food-ticket-profile">
                  <div className="nobooking-available">
                    <h6>No Booking Available </h6>
                  </div>
                </div>
              ) : (
                ""
              )}
              {pastBooking.length !== 0 && upcomingBooking.length === 0 ? (
                <div className="food-ticket-profile">
                  <div className="nobooking-available">
                    <h6>No Upcoming Booking Available </h6>
                  </div>
                </div>
              ) : (
                ""
              )}
              {upcomingBooking.length === 0 ? (
                ""
              ) : (
                <div className="upcoming">
                  <h3 className="mt-3">Recent Bookings</h3>
                </div>
              )}
              <div className="upcoming-booked">
                {upcomingBooking &&
                  upcomingBooking.map((item, idx) => {
                    return (
                      <>
                        <div className="mybooking-box" key={idx}>
                          <div className="my-booking-poster-name">
                            <div className="mybooking-poster">
                              <img
                                src={filmFoodPoster(item)}
                                alt=""
                                className="img-fluid"
                                width={"100px"}
                                // onError={handleMivImageError}
                              />
                            </div>
                            <div className="mybooking-content">
                              {item?.bookType === "FOOD" ? (
                                ""
                              ) : (
                                <h6>{item?.orderFilmCinema?.filmName}</h6>
                              )}
                              <div className="mybook-drama">
                                {item?.bookType === "FOOD" ? (
                                  ""
                                ) : (
                                  <ul>
                                    <li>
                                      {item?.orderFilmCinema?.certificate}
                                    </li>
                                    <li>
                                      <span className="dots-profile"></span>
                                      {item?.orderFilmCinema?.genre}
                                    </li>
                                    <li>
                                      <span className="dots-profile"></span>
                                      {item?.orderFilmCinema?.language}
                                    </li>
                                  </ul>
                                )}
                              </div>
                              <p>
                                <span className="direction-mybooking">
                                  <a
                                    href={`https://maps.google.com/?q=${item.ltd},${item.lngt}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Image
                                      src="/assets/icons/directprofile.svg"
                                      alt=""
                                      className="img-fluid"
                                      width={10}
                                      height={10}
                                    />
                                  </a>
                                </span>
                                {item?.orderFilmCinema?.theaterName}
                              </p>
                              {item?.orderFood?.foods?.map((item2, idx2) => {
                                return (
                                  <div className="food-line" key={idx2}>
                                    <ul>
                                      <li>
                                        {item2.veg ? (
                                          <Image
                                            src="/assets/icons/veg-icon.svg"
                                            alt="veg"
                                            width={15}
                                            height={15}
                                          />
                                        ) : (
                                          <Image
                                            src="/assets/icons/nonveg.svg"
                                            width={15}
                                            height={15}
                                            alt="non veg"
                                          />
                                        )}
                                        <span className="food mx-1">
                                          {item2.name}
                                        </span>
                                        x{item2.quantity}
                                      </li>
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="mybooking-orderid">
                            <p>{item.orderTicket.showTime}</p>
                            {item?.bookType === "FOOD" ? (
                              ""
                            ) : (
                              <p>{item?.orderTicket.numOfSeats} Seats</p>
                            )}
                            <p>Booking ID: {item?.bookingId}</p>
                            <div className="food-mybooking-ntn">
                              <div className="addfood-mybooking">
                                {item.fa ? (
                                  <button
                                    className="save-btn-edit pointer"
                                    onClick={() => {
                                      haldleAddFood(item);
                                    }}
                                  >
                                    Add Food
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className="details-mybooking">
                                <button
                                  className={
                                    detailLoading
                                      ? "food-details-mybooking btn-opacity"
                                      : "food-details-mybooking"
                                  }
                                  onClick={() => {
                                    setSelectedMovieData(item);
                                    getMovieDetails({
                                      bookType: item.bookType,
                                      bookingId: item.orderIdEx,
                                      theaterId:
                                        item?.orderFilmCinema?.theaterId,
                                      type: "currentBooking",
                                    });
                                  }}
                                >
                                  {detailLoading &&
                                  selectedMovieData?.orderIdEx ===
                                    item?.orderIdEx ? (
                                    <span>
                                      <i className="pi pi pi-spin pi-spinner" />{" "}
                                      Details
                                    </span>
                                  ) : (
                                    "Details"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                          {item.ca_d === true ? (
                            <div className="cancel-booking">
                              <Image
                                src="/assets/icons/cancel-icon.png"
                                alt=""
                                className="img-fluid"
                                width={100}
                                height={100}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    );
                  })}
                {upcomingBooking.length !== 0 && pastBooking.length === 0 ? (
                  <div className="food-ticket-profile">
                    <div className="nobooking-available">
                      <Image
                        src="/assets/icons/nobooking.svg"
                        alt="nobooking"
                        className="img-fluid"
                        width={100}
                        height={50}
                      />
                      {/* <h6>No Past Booking Available </h6>
                      <p>Movie bookings & food orders will appear here</p>
                      <button
                        className="my-book-no"
                        type="submit"
                        onClick={() => navigate("/")}
                      >
                        Book Tickets
                      </button> */}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {pastBooking.length === 0 ? (
                  ""
                ) : (
                  <div className="upcoming">
                    <h3>Past Bookings</h3>
                  </div>
                )}
                {pastBooking &&
                  pastBooking.map((item, idx) => {
                    return (
                      <>
                        <div className="mybooking-box" key={idx}>
                          <div className="my-booking-poster-name">
                            <div className="mybooking-poster">
                              <img
                                src={filmFoodPoster(item)}
                                alt=""
                                // onError={handleMivImageError}
                                className="img-fluid"
                                width={"100px"}
                              />
                            </div>
                            <div className="mybooking-content">
                              <div className="d-flex justify-content-between">
                                {item?.bookType === "FOOD" ? (
                                  ""
                                ) : (
                                  <h6>{item?.orderFilmCinema?.filmName}</h6>
                                )}
                              </div>
                              <div className="mybook-drama">
                                {item?.bookType === "FOOD" ? (
                                  ""
                                ) : (
                                  <ul>
                                    <li>
                                      {item?.orderFilmCinema?.certificate}
                                    </li>
                                    <li>
                                      <span className="dots-profile"></span>
                                      {item?.orderFilmCinema?.genre}
                                    </li>
                                    <li>
                                      <span className="dots-profile"></span>
                                      {item?.orderFilmCinema?.language}
                                    </li>
                                  </ul>
                                )}
                              </div>
                              <p>
                                <a
                                  href={`https://maps.google.com/?q=${item?.orderFilmCinema?.latitude},${item?.orderFilmCinema?.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="direction-mybooking mt-2">
                                    <Image
                                      src="/assets/icons/directprofile.svg"
                                      alt=""
                                      className="img-fluid"
                                      width={10}
                                      height={10}
                                    />
                                  </span>
                                </a>
                                {item?.orderFilmCinema?.theaterName}
                              </p>
                              {item?.orderFood?.foods?.map((item2, idx2) => {
                                return (
                                  <div className="food-line" key={idx2}>
                                    <ul>
                                      <li>
                                        {item2.veg ? (
                                          <Image
                                            src="/assets/icons/veg-icon.svg"
                                            alt="veg"
                                            width={15}
                                            height={15}
                                          />
                                        ) : (
                                          <Image
                                            src="/assets/icons/nonveg.svg"
                                            width={15}
                                            height={15}
                                            alt="non veg"
                                          />
                                        )}
                                        <span className="food mx-1">
                                          {item2.name}
                                        </span>
                                        x{item2.quantity}
                                      </li>
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="mybooking-orderid">
                            <p>{item.orderTicket.showTime}</p>
                            {item?.bookType === "FOOD" ? (
                              ""
                            ) : (
                              <p>
                                {item?.orderTicket.numOfSeats}{" "}
                                {item?.orderTicket.numOfSeats > 1
                                  ? "Seats"
                                  : "Seat"}
                              </p>
                            )}
                            <p>Booking ID: {item?.bookingId}</p>
                            <div className="food-mybooking-ntn">
                              <div className="addfood-mybooking"></div>
                              <div className="details-mybooking">
                                <button
                                  className={
                                    detailLoading
                                      ? "food-details-mybooking btn-opacity"
                                      : "food-details-mybooking"
                                  }
                                  onClick={() => {
                                    setSelectedMovieData(item);
                                    getMovieDetails({
                                      bookType: item.bookType,
                                      bookingId: item.orderIdEx,
                                      theaterId:
                                        item?.orderFilmCinema?.theaterId,
                                      type: "pastBooking",
                                    });
                                  }}
                                >
                                  {detailLoading &&
                                  selectedMovieData?.orderIdEx ===
                                    item?.orderIdEx ? (
                                    <span>
                                      <i className="pi pi pi-spin pi-spinner" />{" "}
                                      Details
                                    </span>
                                  ) : (
                                    "Details"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-ticket">
        <Dialog
          header="Ticket Details"
          visible={visibleRight}
          maximizable
          modal
          style={isMobile ? { width: "95vw" } : { width: "70vw" }}
          onHide={() => {
            setVisibleRight(false);
            setSelectedMovieData(null);
          }}
          blockScroll
          dismissableMask
        >
          <div className="card Final-ticket-box p-3">
            <div className="mybooking-box">
              <div className="my-booking-poster-name">
                <div className="mybooking-poster">
                  <img
                    src={
                      finalTicket?.data?.orderFilmCinema?.posterVert
                        ? finalTicket?.data?.orderFilmCinema?.posterVert
                        : "/assets/default/vertical-deafault.png"
                    }
                    alt=""
                    className="img-fluid"
                    width="100px"
                  />
                </div>
                <div className="mybooking-content">
                  <h6>{finalTicket?.data?.orderFilmCinema?.filmName}</h6>
                  <div className="mybook-drama">
                    <ul>
                      <li>{finalTicket?.data?.orderFilmCinema?.certificate}</li>
                      <li>
                        <span className="dots-profile"></span>
                        {finalTicket?.data?.orderFilmCinema?.genre}
                      </li>
                      <li>
                        <span className="dots-profile"></span>
                        {finalTicket?.data?.orderFilmCinema?.language}
                      </li>
                    </ul>
                  </div>
                  <p>
                    <span className="direction-mybooking">
                      <a
                        href="https://maps.google.com/?q=,"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        D
                        {/* <img src={Direction} alt="" className="img-fluid" /> */}
                      </a>
                    </span>
                    {finalTicket?.data?.orderFilmCinema?.theaterName}
                  </p>
                  <p>
                    Booking ID{" "}
                    <span className="cinema-id">
                      {" "}
                      {finalTicket?.data?.bookingId}
                    </span>
                  </p>
                  <p>
                    Payment mode{" "}
                    <span className="cinema-id">
                      {finalTicket?.data?.payMode}
                    </span>
                  </p>
                </div>
              </div>
              <div className="order-content">
                <div className="scanner">
                  <img
                    width="80"
                    alt="qr"
                    className="img-fluid"
                    src={
                      finalTicket?.data?.qr
                        ? finalTicket?.data?.qr
                        : "/assets/icons/qr.png"
                    }
                  />
                </div>
                <div className="mybooking-orderid">
                  <h6>ORDER ID</h6>
                  <p>{finalTicket?.data?.orderIdEx}</p>
                  <a target="_blank" rel="noopener noreferrer" href="#"></a>
                </div>
              </div>
            </div>
            <div className="divider-line-cinema"></div>
            <div className="booking-order">
              <div className="row">
                <div className="col-md-2 col-sm-12">
                  <div className="payment-id">
                    <h6>Booking ID</h6>
                    <p>{finalTicket?.data?.bookingId}</p>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="payment-id">
                    <h6>Payment Mode</h6>
                    <p>{finalTicket?.data?.payMode}</p>
                  </div>
                </div>
                <div className="col-md-2 col-sm-12">
                  <div className="payment-id">
                    <h6>BOOKING DATE</h6>
                    <p>{finalTicket?.data?.bookingTime?.split(" ")[0]}</p>
                  </div>
                </div>
                <div className="col-md-2 col-sm-12">
                  <div className="payment-id">
                    <h6>BOOKING Time</h6>
                    <p>{finalTicket?.data?.bookingTime?.split(" ")[1]}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider-line-cinema"></div>
            <div className="booking-order">
              <div className="row">
                <div className="col-md-2 col-sm-12">
                  <div className="payment-id">
                    <h6>DATE</h6>
                    <p>
                      {finalTicket?.data?.showTimeStr?.split(", ")[0]},{" "}
                      {finalTicket?.data?.showTimeStr?.split(", ")[1]}
                    </p>
                  </div>
                </div>
                <div className="col-md-2 col-sm-12">
                  <div className="payment-id">
                    <h6>Time</h6>
                    <p>{finalTicket?.data?.showTimeStr?.split(", ")[2]}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider-line-cinema-transpert"></div>
            <div className="booking-order">
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="payment-id">
                    <h6>Seats INFO</h6>
                    <p className="audi">
                      {finalTicket?.data?.orderTicket?.audi} -{" "}
                      {finalTicket?.data?.orderTicket?.showClassName}
                    </p>
                  </div>
                  <div className="seat-number-cinemas">
                    <ul>
                      {finalTicket?.data?.orderTicket?.seats
                        ?.split(", ")
                        ?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider-line-cinema-transpert"></div>
            <div className="booking-order">
              <div className="row">
                <div className="col-md-4 col-sm-12">
                  <div className="payment-id">
                    <p className="audi">Food &amp; BEVERAGES</p>
                  </div>
                  {finalTicket?.data?.orderFood?.foods?.map((item, idx) => (
                    <div className="food-list" key={idx}>
                      <div className="food-name">
                        <p>
                          <span className="veg-icon">
                            <Image
                              src={
                                item.veg
                                  ? "/assets/icons/veg-icon.svg"
                                  : "/assets/icons/nonveg.svg"
                              }
                              alt=""
                              className="img-fluid"
                              width={15}
                              height={15}
                            />
                          </span>
                          {item.name}
                        </p>
                      </div>
                      <div className="food-quanity">
                        <p>X {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-md-8 col-sm-12 end">
                  {finalTicket?.type === "currentBooking" ? (
                    <div
                      className="payment-food"
                      onClick={() => {
                        haldleAddFood(finalTicket?.data);
                      }}
                    >
                      <span className="Add-food pointer">Add Food</span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="divider-line-cinema-transpert"></div>
            <div className="booking-order">
              <div className="Ticket Summary">
                <div className="Summary">
                  <h5>Ticket Summary</h5>
                </div>
                <div className="Summary-price">
                  <h5>{finalTicket?.data?.totalAmount}</h5>
                </div>
              </div>
              <div className="Ticket_Summary">
                <div className="Summarys">
                  <h5>
                    {finalTicket?.data?.orderTicket?.numOfSeats} X{" "}
                    {finalTicket?.data?.orderTicket?.showClassName} Seats{" "}
                  </h5>
                </div>
                <div className="Summary-price">
                  <h5>{finalTicket?.data?.orderTicket?.totalTicketPrice}</h5>
                </div>
              </div>
              <div className="Ticket_Summary">
                <div className="Summarys">
                  <h5>{finalTicket?.data?.orderFood?.fbCount} x Food Items </h5>
                </div>
                <div className="Summary-price">
                  <h5>{finalTicket?.data?.orderFood?.fbTotalPrice}</h5>
                </div>
              </div>
              <div className="taxes">
                <div className="Summary">
                  <h5>Taxes &amp; Fees</h5>
                </div>
              </div>
              <div className="Ticket_Summary">
                <div className="Summarys">
                  <h5>Convenience Fee</h5>
                </div>
                <div className="Summary-price">
                  <h5>{finalTicket?.data?.orderTicket?.conv}</h5>
                </div>
              </div>
              <div className="Ticket_Summary">
                <div className="Summarys">
                  <h5>GST</h5>
                </div>
                <div className="Summary-price">
                  <h5>{finalTicket?.data?.orderTicket?.convGst}</h5>
                </div>
              </div>
              <div className="Ticket_Summary">
                <div className="Summarys">
                  <h5>Order ID</h5>
                </div>
                <div className="Summary-price">
                  <h5>{finalTicket?.data?.orderIdEx}</h5>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
      <ConfirmMessageDialog
        icon={"error"}
        visible={showAlert}
        onHide={() => setShowAlert(false)}
        title={""}
        message={"Oops"}
        showConfirmButton={true}
        confirmButtonText={"OK"}
        showCancelButton={false}
        cancelButtonText={"No"}
        onConfirm={() => {
          setShowAlert(false);
        }}
        onCancel={() => setShowAlert(false)}
        closable={false}
        timer={2000}
      />
    </>
  );
};

export default MyBookings;
