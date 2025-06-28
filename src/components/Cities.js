"use client";
import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { MyContext } from "@/context/ThemeContext";
import * as appConstants from "../constants/index";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Cities() {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedCityName, handleCityNameChange, handleCityChange } =
    useContext(MyContext);
  const [locationPermission, setLocationPermission] = useState(null);
  const [otherCity, setOtherCity] = useState([]);
  const staticPageUrl = [
    "/about-us",
    "/advertise",
    "/faq",
    "/privacy-policy",
    "/terms-conditions",
  ];

  // console.log("city", Cookies.get("city"), selectedCityName);
  // console.log("pathname", pathname);

  useEffect(() => {
    getCityData(Cookies.get("lat") || "0.000", Cookies.get("long") || "0.000");

    if (!staticPageUrl.includes(pathname)) {
      requestLocationPermission(); // Request location permission on component mount
    }
  }, []);

  const requestLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationPermission("granted");

        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        Cookies.set("lat", lat);
        Cookies.set("long", long);

        getCityData(lat, long); // Call getCityData after getting location
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationPermission("denied");
          getCityData("0.000", "0.000");
        } else {
          setLocationPermission("prompt");
          getCityData("0.000", "0.000");
        }
      }
    );
  };

  const getCityData = async (latVal, longVal) => {
    const postData = {
      lat: latVal,
      lng: longVal,
    };
    await axios
      .post(`${appConstants.BASE_URL}v1/booking/content/city`, postData, {
        headers: {
          chain: appConstants.chain,
          city: Cookies.get("city") || "",
          appVersion: appConstants.appVersion,
          platform: appConstants.appPlatform,
          country: appConstants.countryName,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const dt = res.data;
        if (dt.result === "success") {
          const ndt = dt.output;
          setOtherCity(ndt.ot);
          if (selectedCityName === null && Cookies.get("city") === undefined) {
            // console.log("permission granted", ndt?.cc?.name);
            const randomNum = Math.floor(100000 + Math.random() * 900000);
            handleCityChange(randomNum);
            handleCityNameChange(ndt?.cc?.name);
            Cookies.set("city", ndt?.cc?.name);
          }
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const handleChangeCity = (data, latLang) => {
    Cookies.set("city", data.name);
    handleCityNameChange(data.name);
    Cookies.set("lat", latLang?.lat || "0.00");
    Cookies.set("long", latLang?.long || "0.00");
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    handleCityChange(randomNum);
    if (typeof window !== "undefined" && pathname === "/") {
      window.location.reload();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <div className="movietime-cities">
        {otherCity?.length > 0
          ? otherCity?.map((item, idx) => {
              return (
                <ul key={idx}>
                  <li
                    onClick={() => {
                      handleChangeCity(item, {
                        lat: item.lat,
                        long: item.lng,
                      });
                    }}
                  >
                    {item.name}
                  </li>
                </ul>
              );
            })
          : "City not found"}
      </div>
    </>
  );
}
