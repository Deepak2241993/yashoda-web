"use client";
import { useEffect } from "react";
import * as appConstants from "../../../constants/index";
import axios from "axios";
import swal from "sweetalert";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const PaymentStatus = () => {
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    getPaytmPaymentStatus();
  }, []);

  const getPaytmPaymentStatus = async () => {
    const postData = {
      bookingId: Cookies.get("bookingid"),
      paymentId: "",
      bookType: Cookies.get("booking_type"),
    };
    try {
      await axios
        .post(`${appConstants.BASE_URL}v1/payment/razorpay/status`, postData, {
          headers: {
            Authorization: `Bearer ${token}`,
            appVersion: appConstants.appVersion,
            platform: appConstants.appPlatform,
            country: appConstants.countryName,
          },
        })
        .then((resp) => {
          const dt = resp.data;
          if (dt.result === "success") {
            const ndt = dt.output;
            if (ndt.p === "PAID") {
              if (Cookies.get("booking_type") === "MOVIECARD") {
                router.push("/moviecard-ticket", { scroll: false });
              } else if (Cookies.get("booking_type") === "FOOD") {
                router.push("/food-ticket", { scroll: false });
              } else {
                router.push("/booking", { scroll: false });
              }
            } else if (ndt.p === "FAILED") {
              showerrorMsg(dt.msg);
              setTimeout(() => router.push("/", { scroll: false }), 2500);
            } else if (ndt.p === "PENDING") {
              showerrorMsg("Payment is pending.");
              setTimeout(() => router.push("/", { scroll: false }), 2500);
            } else if (ndt.p === "TXN_FAILURE") {
              showerrorMsg(dt.msg);
              setTimeout(() => router.push("/", { scroll: false }), 2500);
            }
          } else {
            showerrorMsg(dt.msg);
            setTimeout(() => router.push("/", { scroll: false }), 2500);
          }
        });
    } catch (err) {
      console.error("Error", err);
    }
  };

  const showerrorMsg = (msgVal) => {
    swal({
      text: msgVal,
      timer: 2000,
      icon: "error",
      buttons: false,
    });
  };

  const loadingUI = () => {
    return (
      <div
        className="pt-3 d-flex justify-content-center align-items-center bg-theme-light2"
        style={{ height: "100vh" }}
      >
        <div>
          <i
            className="pi pi-spin pi-spinner text-theme-dark1"
            style={{ fontSize: "5em" }}
          ></i>
          <p className="text-white">
            Payment is under process. Please wait ...
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div>{loadingUI()}</div>
    </>
  );
};

export default PaymentStatus;
