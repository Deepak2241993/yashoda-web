import axios from "axios";
import * as appConstants from "../constants/index";
import Cookies from "js-cookie";
import { refraceTokenService } from "./refreshToken";

const cityName = Cookies.get("city");

export const getNowShowingData = async (ptVal) => {
  const postData = {
    city: cityName,
  };

  try {
    const response = await axios.post(
      `${appConstants.BASE_URL}v1/booking/content/nowshowing`,
      postData,
      {
        headers: {
          chain: appConstants.chain,
          city: cityName,
          appVersion: appConstants.appVersion,
          platform: ptVal,
          country: appConstants.countryName,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.result === "success") {
      return data.output;
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getMovieSessionsData = async (dataVal) => {
  let dated = dataVal.date;
  if (dated == "NA") dated = new Date().toISOString().slice(0, 10);

  setLoading(true);
  const postData = {
    city: cityName,
    mid: mid,
    experience: experienceText?.length > 0 ? experienceText?.toString() : "ALL",
    lat: Cookies.get("lat") || "0.00",
    lng: Cookies.get("long") || "0.00",
    lang: language?.length > 0 ? language?.toString() : "ALL",
    format: formatText?.length > 0 ? formatText?.toString() : "ALL",
    dated: date,
    time: "ALL",
    // time: `${convertToTime(showTime[0])}-${convertToTime(showTime[1])}`,
    cinetype: Cookies.get("cinetype") || "ALL",
    hc: accessiblityText ? "hc" : "ALL",
  };

  try {
    const response = await axios.post(
      `${appConstants.BASE_URL}v1/booking/content/msessions`,
      postData,
      {
        headers: {
          chain: appConstants.chain,
          city: cityName,
          appVersion: appConstants.appVersion,
          platform: ptVal,
          country: appConstants.countryName,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.result === "success") {
      return data.output;
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postApiService = async (
  postData,
  endPoint,
  ptVal,
  headerCity = "Delhi-NCR"
) => {
  try {
    const response = await axios.post(
      `${appConstants.BASE_URL}${endPoint}`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token") || " "}`,
          chain: appConstants.chain,
          city: headerCity,
          appVersion: appConstants.appVersion,
          platform: ptVal,
          country: appConstants.countryName,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    const err = error?.response;
    if (err?.status === 403) {
      refraceTokenService();
      console.log(
        "Forbidden: You do not have permission to access this resource."
      );
    } else {
      console.log("Error:", error?.message);
    }
    console.error("Error making API request:", error);
    throw error;
  }
};

export const getApiService = async (
  endPoint,
  ptVal,
  headerCity = "Delhi-NCR"
) => {
  try {
    const response = await axios.get(
      `${appConstants.BASE_URL}${endPoint}`,

      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token") || " "}`,
          chain: appConstants.chain,
          city: headerCity,
          appVersion: appConstants.appVersion,
          platform: ptVal,
          country: appConstants.countryName,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    const err = error?.response;
    if (err?.status === 403) {
      refraceTokenService();
      console.log(
        "Forbidden: You do not have permission to access this resource."
      );
    } else {
      console.log("Error:", error?.message);
    }
    console.error("Error making API request:", error);
    throw error;
  }
};
