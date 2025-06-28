"use client"
import axios from "axios";
import * as appConstants from "../constants/index";
import Cookies from "js-cookie";

export const refraceTokenService = async () => {
  const theme = localStorage.getItem('theme');
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
  const refresh_token = loginInfo?.refresh?.token;

  const postData = {
    refreshToken: localStorage.getItem('refrace_token'),
  };

  await axios
    .post(`${appConstants.BASE_URL}v1/auth/refresh-tokens`, postData, {
      headers: {
        chain: appConstants.chain,
        city: Cookies.get("token"),
        appVersion: appConstants.appVersion,
        platform: appConstants.appPlatform,
        country: appConstants.countryName,
      },
    })
    .then((res) => {
      const dt = res.data;
      if (dt.result === "success") {
        const ndt = dt.output;
        Cookies.set('token', ndt?.access?.token);
        Cookies.set('refrace_token', ndt?.refresh?.token)
        window.location.reload();
        console.log("ticketSummary==>", ndt);
      } else {
        console.log('Refrace-Token-Error', res.data.msg);
        Cookies.remove("loginInfo");
        Cookies.remove('token');
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }

      if (res.status === 403) {
        Cookies.remove("loginInfo");
        Cookies.remove('token');
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    })
    .catch((err) => {
      console.log("error", err);
      Cookies.remove("loginInfo");
      Cookies.remove('token');
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    });
};
