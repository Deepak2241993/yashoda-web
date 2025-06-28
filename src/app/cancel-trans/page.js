"use client";
import React, { useContext, useEffect, useState } from "react";
import * as appConstants from "../../constants/index";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MyContext } from "@/context/ThemeContext";
import Cookies from "js-cookie";


const CancelTrans = () => {
  const router = useRouter();
  const { isMobile } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cancelTrnsService();
  }, []);

  const cancelTrnsService = async () => {
    setLoading(true);
    const postData = {
      qr: Cookies.get("isQR") && isMobile ? "YES" : "NO",
      bookType: Cookies.get("booking_type"),
      transId: Cookies.get("transid"),
      bookingId: Cookies.get("bookingid"),
      ccode: Cookies.get("theaterId"),
    };

    await axios
      .post(`${appConstants.BASE_URL}v1/booking/ticketing/cancel`, postData, {
        headers: {
          chain: appConstants.chain,
          city: Cookies.get("city"),
          Authorization: `Bearer ${Cookies.get("token") || ""}`,
          appVersion: appConstants.appVersion,
          platform: appConstants.appPlatform,
          country: appConstants.countryName,
        },
      })
      .then((res) => {
        const dt = res.data;

        if (dt.result === "success") {
          const ndt = dt.output;
          Cookies.remove("transid");
          Cookies.remove("bookingid");
          Cookies.remove("theaterId");
          setTimeout(() => router.push("/"), 3000);
        } else {
          setTimeout(() => router.push("/"), 3000);
        }
        setLoading(false);
      })
      .catch((error) => {
        const err = error?.response;
        console.log("Error:", error.message);
        setLoading(false);
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
            style={{
              fontSize: "5em",
            }}
          ></i>
          <p className="text-white">
            {loading ? "Canceling ..." : "Redirecting ..."}
          </p>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div>{loadingUI()}</div>
    </div>
  );
};

export default CancelTrans;
