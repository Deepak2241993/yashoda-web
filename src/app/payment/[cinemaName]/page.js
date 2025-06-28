"use client";
import React, { useState, useEffect, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import "./newpayment.css";
import axios from "axios";
import * as appConstants from "../../../constants/index";
import swal from "sweetalert";
import { Dialog } from "primereact/dialog";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'
import Login from "@/components/Login";
import { MyContext } from "@/context/ThemeContext";

const Payment = () => {
  const router = useRouter()
  const token = Cookies.get("token");
  const bookingType = Cookies.get("booking_type");
  const {isMobile, isLoginChanged } = useContext(MyContext);
  const loginInfo = Cookies?.get("loginInfo") && JSON.parse(Cookies?.get("loginInfo"));
  const [promoCodeValue, setPromoCodeValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [ticketSummaryData, setTicketSummaryData] = useState(null);
  const [ticketSummaryLoading, setTicketSummaryLoading] = useState(false);
  const [paymodeListLoading, setPaymodeListLoading] = useState(false);
  const loginVewMode = 0;
  const [paymentModes, setPaymentModes] = useState(null);
  const [hmacLoading, setHmacLoading] = useState(false);
  const [promoCodeLoading, setPromoCodeLoading] = useState(false);
  const [selectedPaymodePid, setSelectedPaymodePid] = useState("");
  const [appliedPromoCodeData, setAppliedPromoCodeData] = useState(null);
  const [movieCardVoucherData, setMovieCardVoucherData] = useState(null);
  const isQrFlow = Cookies.get("fnb_qr");
  const [loginViewMode, setLoginViewMode] = useState(false);

  // console.log('isLoginChanged', isLoginChanged)


  useEffect(() => {
    if (token) {
      if (bookingType === "BOOKING") {
        getMovieCardVoucherLists();
      }
      if (bookingType !== "MOVIECARD") {
        getTicketSummaryData();
      }
    } else {
      setLoginViewMode(true);
    }
    setSelectedPaymodePid("");
    loadRazorpayScript()
  }, [isLoginChanged]);

  const getTicketSummaryData = async () => {
    setTicketSummaryLoading(true);
    const postData = {
      qr:
        Cookies.get("isQR") && isMobile
          ? "YES"
          : Cookies.get("fnb_qr") === "true" && isMobile
          ? "YES"
          : "NO",
      bookType: bookingType,
      transId: Cookies.get("transid"),
      bookingId: Cookies.get("bookingid"),
      ccode: Cookies.get("theaterId"),
      donate: false,
    };

    await axios
      .post(`${appConstants.BASE_URL}v1/booking/ticketing/summary`, postData, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
          appVersion: appConstants.appVersion,
          platform: appConstants.appPlatform,
          country: appConstants.countryName,
        },
      })
      .then((res) => {
        const dt = res.data;
        if (dt.result === "success") {
          const ndt = dt.output;
          setTicketSummaryData(ndt);
          localStorage.setItem("grandVal", ndt?.finalAmount);
          // dispatch(
          //   setGrandTotalamount({
          //     cutPrice: Number(
          //       ndt?.finalAmount != ndt?.totalAmount ? ndt?.totalAmount : 0
          //     ),
          //     finalPrice: Number(ndt?.finalAmount.replace(/,/g, "")),
          //   })
          // );
          setTicketSummaryLoading(false);
          localStorage.setItem("quantity", ndt.orderTicket.numOfSeats);
          localStorage.setItem("price", ndt.totalAmount);
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
        setTicketSummaryLoading(false);
      });
  };

  const getMovieCardVoucherLists = async () => {
    setPaymodeListLoading(true);
    const postData = {};

    await axios
      .post(`${appConstants.BASE_URL}v1/movicard/vouchers`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          appVersion: appConstants.appVersion,
          platform: appConstants.appPlatform,
          chain: appConstants.chain,
          city: Cookies.get("city"),
          country: appConstants.countryName,
        },
      })
      .then((res) => {
        const dt = res.data;
        if (dt.result === "success") {
          const ndt = dt.output;
          setMovieCardVoucherData(ndt?.vouchers);
          // console.log('getMovieCardVoucherLists', ndt)
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
        setPaymodeListLoading(false);
      });
  };

  const getHmacData = async () => {
    setHmacLoading(true);
    const postData = {
      transId: Cookies.get("transid"),
      bookingId: Cookies.get("bookingid"),
      bookType: bookingType,
      paytype: "RAZORPAY",
      mandate: true,
    };

    await axios
      .post(`${appConstants.BASE_URL}v1/payment/razorpay/hmac`, postData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          appVersion: appConstants.appVersion,
          platform: appConstants.appPlatform,
          chain: appConstants.chain,
          city: Cookies.get("city"),
          country: appConstants.countryName,
        },
      })
      .then((res) => {
        const dt = res.data;
        console.log("resp", dt);
        if (dt.result === "success") {
          const ndt = dt.output;
          // loadRazorpayScript();
          handlePayment(ndt);
          setHmacLoading(false);
        } else {
          console.log(res.data.msg);
          swal({
            text: dt.msg,
            timer: 2000,
            icon: "error",
            buttons: false,
          });
          setHmacLoading(false);
          setSelectedPaymodePid("");
        }
      })
      .catch((err) => {
        console.log("error", err);
        setHmacLoading(false);
      });
  };

  const applyPromoCodeService = async (couponCode, voucherType) => {
    setPromoCodeLoading(true);
    const postData = {
      ccode: Cookies.get("theaterId"),
      bookingId: Cookies.get("bookingid"),
      transId: Cookies.get("transid"),
      bookType: bookingType,
      couponId: 0,
      coupon: couponCode,
      couponType: voucherType,
      qr: "NO",
      card: "",
      mobile: "",
      otp: "",
    };

    await axios
      .post(`${appConstants.BASE_URL}v1/payment/coupon/apply`, postData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          chain: appConstants.chain,
          city: Cookies.get("city"),
          appVersion: appConstants.appVersion,
          platform: appConstants.appPlatform,
          country: appConstants.countryName,
        },
      })
      .then((res) => {
        const dt = res.data;
        console.log("resp", dt);
        if (dt.result === "success") {
          const ndt = dt.output;
          setAppliedPromoCodeData(ndt);
          getTicketSummaryData();
          swal({
            title: dt.output ? "Congrats !" : "Oops",
            text: ndt?.txt ? ndt?.txt : dt.msg,
            timer: 2000,
            icon: dt.output ? "success" : "error",
            buttons: false,
          });
        } else {
          setChecked(false);
          console.log(res.data.msg);
          swal({
            text: dt.msg,
            timer: 2000,
            icon: "error",
            buttons: false,
          });
          setPromoCodeLoading(false);
        }
      })
      .catch((err) => {
        console.log("error", err);
        setPromoCodeLoading(false);
      });
  };

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const handlePayment = async (data) => {
    try {
      const options = {
        key: data.rkey, // Razorpay Key ID
        amount: data.amount * 100, // Amount is in paise
        currency: data.currency || "INR",
        order_id: data.orderId, // Order ID from backend response
        name: "Movietime",
        description: "Movie Ticket Booking - Enjoy Your Show!",
        image: "/movie-icon.png",
        handler: (response) => {
          // console.log("Payment Successful", response);
          router.push("/payment-status/razorpayex", { scroll: false });
        },
        prefill: {
          name: loginInfo?.data?.un,
          email: loginInfo?.data?.em,
          contact: loginInfo?.data?.mob,
        },
        theme: {
          color: "#CC1821",
        },
      };
      const rzp = typeof window !== "undefined" && new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        console.log("Payment Failed: ", response.error);
      });

      rzp.open();
    } catch (error) {
      console.error("Error in creating order or payment process", error);
      swal({
        text: "Payment failed. Please try again later.",
        timer: 3000,
        icon: "error",
        buttons: false,
      });
    }
  };


  const movieCardPaymentService = () => {
    return (
      <div>
        <p>Email: {savedMovieCardInfo?.email}</p>
        <span>Name: {loginInfo?.data?.un}</span>
        <div className="payment-divider-movie-time"></div>
        <p>Grand Total: ₹{savedMovieCardInfo?.totalPrice}</p>
      </div>
    );
  };

  const subTotalAmount = (ticketSummaryDataVal) => {
    const ticketPrice = parseFloat(
      ticketSummaryDataVal?.orderTicket?.totalTicketPrice?.replace(/,/g, "")
    );
    const foodPrice = parseFloat(
      ticketSummaryDataVal?.orderFood?.fbTotalPrice?.replace(/,/g, "")
    );
    const isInteger = (num) => Number.isInteger(num);
    const totalAmt = ticketPrice + foodPrice;
    return isInteger(totalAmt) ? `${totalAmt}.00` : totalAmt;
  };

  return (
    <>
      <div
        className="bg-white show-in-desktop-view"
        style={{ position: "sticky", top: "0", zIndex: "999" }}
      >
        {/* <PaymentNavbar /> */}
      </div>
      <div className="payment-mobile-header show-in-mobile-view">
        <div className="payment-header-item">
          <span
            onClick={() => {
              // navigate("/");
            }}
          >
            {" "}
            <img src="/assets/icons/arrow-b.svg" alt="" className="" />{" "}
          </span>
          <h4>Payment</h4>
        </div>
        <div className="search-mobile-cinemas"></div>
      </div>
      {bookingType === "MOVIECARD" ? (
        ""
      ) : (
        <>
          <section
            className="movie-time-banner"
            style={{
              backgroundImage: `url(${
                ticketSummaryData?.orderFilmCinema?.posterHori
                  ? ticketSummaryData?.orderFilmCinema?.posterHori
                  : "/assets/default/cinema.png"
              })`,
              height: "350px",
            }}
          >
            <div className="container view-container">
              <div className="row">
                <div className="col-md-12 col-sm-12"></div>
              </div>
            </div>
          </section>
          <section>
            <div className="container view-container">
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="banner-show-movie">
                    <div className="movie-times-details">
                      <h2>{ticketSummaryData?.orderFilmCinema?.filmName}</h2>
                      <div className="movie-time-ua">
                        {isQrFlow === "true" ? (
                          ""
                        ) : (
                          <ul>
                            <li>
                              {ticketSummaryData?.orderFilmCinema?.certificate}
                            </li>
                            <li>{ticketSummaryData?.showTimeStr}</li>
                            <li>{ticketSummaryData?.orderFilmCinema?.genre}</li>
                            <li>
                              {ticketSummaryData?.orderFilmCinema?.language}
                            </li>
                          </ul>
                        )}
                      </div>
                      <p>{ticketSummaryData?.orderFilmCinema?.theaterName}</p>
                      {isQrFlow === "true" ? (
                        ""
                      ) : (
                        <>
                          <p>Seat Info</p>
                          <p>{`${ticketSummaryData?.orderTicket?.audi} - ${ticketSummaryData?.orderTicket?.showClassName}`}</p>
                          <div className="seat-movie-time">
                            <ul>
                              {ticketSummaryData?.orderTicket?.seats
                                ?.split(",")
                                ?.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      <section className={bookingType === "MOVIECARD" ? "my-3" : "ptb-80"}>
        <div className="container view-container">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="payment-method-movie-time">
                <div className="topaid">
                  <div className="paid">
                    <h6>To be Paid:</h6>
                  </div>
                  {ticketSummaryData?.totalAmount ===
                  ticketSummaryData?.finalAmount ? (
                    <p>₹{ticketSummaryData?.finalAmount}</p>
                  ) : (
                    <p>
                      <span className="cut-price-movie-time">
                        ₹{ticketSummaryData?.totalAmount}
                      </span>
                      ₹{ticketSummaryData?.finalAmount}
                    </p>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="title-head payment-voucer">
                      <h6>AVAILABLE Vouchers </h6>
                    </div>
                  </div>
                  <div className="col-md-12">
                    {bookingType === "BOOKING" ? (
                      <div
                        className={
                          appliedPromoCodeData
                            ? "passport-voucher-card btn-disabled"
                            : "passport-voucher-card"
                        }
                      >
                        {movieCardVoucherData?.length > 0
                          ? movieCardVoucherData?.map((item, idx) => {
                              return (
                                <div
                                  className="movie-time-voucher-pass"
                                  key={idx}
                                >
                                  <div className="movie-time-card">
                                    <div className="subscription">
                                      <h5>
                                        SUBSCRIPTION <br></br>VOUCHER
                                      </h5>
                                      <h6>MOVIE CARD</h6>
                                    </div>
                                    <div className="red-voucher-number">
                                      <p>{item?.vouNumber}</p>
                                    </div>
                                  </div>
                                  <div className="redmeed-point">
                                    <div className="check-box-circle">
                                      <div className="card flex justify-content-center">
                                        <Checkbox
                                          onChange={(e) => {
                                            setChecked(e.checked);
                                            if (e.checked) {
                                              applyPromoCodeService(
                                                item?.vouNumber,
                                                "MOVIECARD"
                                              );
                                            }
                                          }}
                                          checked={checked}
                                        ></Checkbox>
                                      </div>
                                    </div>
                                    <div className="redmee-movie-time">
                                      <p>Redeem</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          : "Vouchers not available"}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-md-12">
                    <div className="enter-promocode">
                      <div
                        className={
                          appliedPromoCodeData ? "pro btn-disabled" : "pro"
                        }
                      >
                        <InputText
                          value={promoCodeValue}
                          placeholder="Enter Promocode"
                          onChange={(e) => {
                            const val = e.target.value;
                            const valUpperCase = val.toUpperCase();
                            setPromoCodeValue(valUpperCase);
                          }}
                        />
                        <button
                          className={
                            promoCodeValue
                              ? "Apply-prom"
                              : "Apply-prom btn-disabled"
                          }
                          type="button"
                          onClick={() =>
                            applyPromoCodeService(promoCodeValue, "PROMOCODE")
                          }
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="select-method">
                      <button
                        className="book-tickets-btn text-white bg-red-600 px-3 py-2 rounded w-100"
                        onClick={() => getHmacData()}
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              {bookingType === "MOVIECARD" ? (
                movieCardPaymentService()
              ) : (
                <div className="ticket-details-movie">
                  <div className="movie-time-food-details"></div>
                  <div className="movie-time-Bill-details">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="title-head">
                          {isQrFlow === "true" ||
                          Cookies.get("booking_type") !== "BOOKING" ? (
                            ""
                          ) : (
                            <h6>Tickets</h6>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-6">
                        {isQrFlow === "true" ||
                        Cookies.get("booking_type") !== "BOOKING" ? (
                          ""
                        ) : (
                          <div className="ticket-count">
                            <p>{`${ticketSummaryData?.orderTicket?.numOfSeats} X ${ticketSummaryData?.orderTicket?.showClassName}`}</p>
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-6">
                        <div className="ticket-price">
                          {isQrFlow === "true" ||
                          Cookies.get("booking_type") !== "BOOKING" ? (
                            ""
                          ) : (
                            <p>
                              ₹
                              {ticketSummaryData?.orderTicket?.totalTicketPrice}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="title-head">
                          <h6>Food & BEVERAGES</h6>
                        </div>
                      </div>
                      {ticketSummaryData?.orderFood?.foods?.map((item, idx) => (
                        <>
                          <div className="col-md-6 col-6" key={idx}>
                            <div className="ticket-count">
                              <p>
                                {item.quantity} X &nbsp;
                                <span className="veg-movir-time">
                                  <img
                                    src={
                                      item.veg
                                        ? "/assets/icons/veg-icon.svg"
                                        : "/assets/icons/nonveg.svg"
                                    }
                                    alt=""
                                    className="img-fluid"
                                  />
                                </span>
                                {item.name}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6 col-6">
                            <div className="ticket-price">
                              <p>
                                ₹
                                {((item.price * item.quantity) / 100).toFixed(
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        </>
                      ))}
                      <div className="col-md-12">
                        <div className="payment-divider-movie-time"></div>
                      </div>
                      <div className="col-md-12">
                        <div className="title-head">
                          <h6>Bill Details</h6>
                        </div>
                      </div>
                      <div className="col-md-6 col-6">
                        <div className="ticket-count">
                          <p>Sub Total</p>
                        </div>
                      </div>
                      <div className="col-md-6 col-6">
                        <div className="ticket-price">
                          <p>₹{subTotalAmount(ticketSummaryData)}</p>
                        </div>
                      </div>
                      {isQrFlow === "true" ? (
                        ""
                      ) : (
                        <>
                          <div className="col-md-6 col-6">
                            <div className="ticket-count">
                              <p>Convenience Fee</p>
                            </div>
                          </div>
                          <div className="col-md-6 col-6">
                            <div className="ticket-price">
                              <p>₹{ticketSummaryData?.orderTicket?.conv}</p>
                            </div>
                          </div>
                          <div className="col-md-6 col-6">
                            <div className="ticket-count">
                              <p>Taxes & Fees(GSTIN-07aaacp4526d1zs)</p>
                            </div>
                          </div>
                          <div className="col-md-6 col-6">
                            <div className="ticket-price">
                              <p>₹{ticketSummaryData?.orderTicket?.convGst}</p>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="col-md-12">
                        <div className="payment-dashed-movie-time"></div>
                      </div>
                      <div className="col-md-6 col-6">
                        <div className="ticket-count">
                          <p>Discount</p>
                        </div>
                      </div>
                      <div className="col-md-6 col-6">
                        <div className="ticket-price">
                          <p>₹ {ticketSummaryData?.orderTicket?.discount}</p>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="payment-divider-movie-time"></div>
                      </div>
                      <div className="col-md-6 col-6">
                        <div className="ticket-count">
                          <p>
                            <b>Total</b>
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6 col-6">
                        <div className="ticket-price">
                          {ticketSummaryData?.totalAmount ===
                          ticketSummaryData?.finalAmount ? (
                            <p>₹{ticketSummaryData?.finalAmount}</p>
                          ) : (
                            <p>
                              <span className="cut-price-movie-time">
                                ₹{ticketSummaryData?.totalAmount}
                              </span>
                              ₹{ticketSummaryData?.finalAmount}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="">
      <Login
          loginViewMode={loginViewMode}
          onHide={() => setLoginViewMode(false)}
        />
      </div>
    </>
  );
};

export default Payment;
