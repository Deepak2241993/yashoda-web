"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Cities from "./Cities";
import Cookies from "js-cookie";
import { MyContext } from "@/context/ThemeContext";
import Login from "./Login";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/navigation";
import { postApiService } from "../utils/api";
import ConfirmMessageDialog from "@/global-functions/ConfirmMessageDialog";

export default function Navbar() {
  const router = useRouter();
  const { isMobile, currentPath, profileDetails, selectedCityName } =
    useContext(MyContext);
  const ptValue = isMobile ? "MSITE" : "WEBSITE";
  const [activeNavItem, setActiveNavItem] = useState(0);
  const [cityName, setCityName] = useState("Select City");
  const [loginViewMode, setLoginViewMode] = useState(false);
  const token = Cookies.get("token");
  const [searchData, setSearchData] = useState([]);
  const [filteredSearchData, setFilteredSearchData] = useState([]);
  const [showMobileSearchBox, setShowMobileSearchBox] = useState(false);
  const [searchText, setSearchText] = useState("");
  const isPaymentPath = currentPath?.split("/")[1] === "payment";
  const city =
    typeof window !== "undefined"
      ? selectedCityName || Cookies.get("city")
      : "Select City";
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  // console.log('cityName', cityName)

  useEffect(() => {
    if (city) {
      setCityName(city);
    }
  }, [city]);

  const haldleClickBack = () => {
    setShowMessageDialog(true);
    setSearchText("");
  };

  const getSearchData = async () => {
    const postData = {
      lat: Cookies.get("lat"),
      lng: Cookies.get("long"),
      type: "HOME",
    };

    try {
      postApiService(postData, "v1/booking/content/search", ptValue).then(
        (res) => {
          const ndt = res.output;
          if (res.result === "success") {
            const dt = res?.output;
            setSearchData([...dt?.ns, ...dt?.cs, ...dt?.cinemas]);
          }
        }
      );
    } catch (error) {
      console.log("home search error", error);
    }
  };

  const handleSearchInput = (val) => {
    setSearchText(val);
    if (val?.length > 0) {
      if (searchData?.length > 0) {
        const filterVal = searchData?.filter((item) =>
          (item?.name || item.n)?.toLowerCase()?.includes(val?.toLowerCase())
        );
        setFilteredSearchData(filterVal);
      } else {
        setFilteredSearchData([]);
      }
    } else {
      setFilteredSearchData([]);
    }
  };

  const handleItemClicked = (item) => {
    let movieSessionUrl1 = `/moviesessions/${Cookies.get("city")}/${item.n}/${
      item.id
    }`;
    let movieSessionUrl = movieSessionUrl1.replace(/\s/g, "-");
    let cinemaSessionUrl1 = `/cinemasessions/${Cookies.get("city")}/${
      item.name
    }/${item.theatreId}`;
    let cinemaSessionUrl = cinemaSessionUrl1.replace(/\s/g, "-");

    if (item.t === "movie") {
      router.push(movieSessionUrl);
      setSearchText("");
      setFilteredSearchData([]);
      // if (currentPath?.split("/")[1] === "moviesessions") {
      // }
    } else {
      router.push(cinemaSessionUrl);
      setSearchText("");
      setFilteredSearchData([]);
      // if (currentPath?.split("/")[1] === "cinemasessions") {
      // }
    }
  };

  return (
    <>
      <div className="fixed-top desktop-view-M show-in-desktop-view">
        <nav className="flex items-center justify-between bg-gray-100 px-24 py-4">
          <div>
            <Image
              src="/assets/brand/yashoda_site_logo.png"
              alt="Brand Image"
              width={150}
              height={60}
              className="pointer brand-img"
              onClick={() => {
                if (isPaymentPath) {
                  haldleClickBack();
                } else {
                  router.push("/");
                }
                setActiveNavItem(0);
              }}
            />
          </div>
          <ul className={isPaymentPath ? "d-none" : "flex space-x-8"}>
            <li className="pt-2" onClick={() => setActiveNavItem(0)}>
              {/* <Link
                href="/"
                className={
                  currentPath === "/"
                    ? "text-sky-700 font-bold"
                    : "font-bold hover:text-sky-700 hover:font-bold my-3"
                }
              > */}
                Specialities
              {/* </Link> */}
            </li>
            <li className="pt-2" onClick={() => setActiveNavItem(2)}>
              {/* <Link
                href="/cinemas"
                className={
                  currentPath === "/cinemas"
                    ? "text-sky-700 font-bold"
                    : "font-bold hover:text-sky-700 hover:font-bold my-3"
                }
              > */}
                Surgeries
              {/* </Link> */}
            </li>
            <li className="pt-2" onClick={() => setActiveNavItem(3)}>
              {/* <Link
                href="/offers"
                className={
                  currentPath === "/offers"
                    ? "text-sky-700 font-bold"
                    : "font-bold hover:text-sky-700 hover:font-bold my-3"
                }
              > */}
                Find Doctors
              {/* </Link> */}
            </li>
          </ul>
          <div className={isPaymentPath ? "btn-disabled" : "pointer"}>
            {token ? (
              <Link href="/profile">
                {" "}
                Welcome,{profileDetails?.DataTransfer?.un} Sartaj Alam
              </Link>
            ) : (
              <span
                className="py-2 px-3 rounded dark-theme-button pointer"
                onClick={() => setLoginViewMode(true)}
              >
                Login
              </span>
            )}
          </div>
        </nav>
        <div>
          <Login
            loginViewMode={loginViewMode}
            onHide={() => setLoginViewMode(false)}
          />
        </div>
        <div>
          <ConfirmMessageDialog
            icon={"info"}
            visible={showMessageDialog}
            onHide={() => setShowMessageDialog(false)}
            title={"Are you sure?"}
            message={"You want to cancel this transaction."}
            showConfirmButton={true}
            confirmButtonText={"Yes, Cancel It !"}
            showCancelButton={true}
            cancelButtonText={"No"}
            onConfirm={() => {
              router.push("/cancel-trans");
              setShowMessageDialog(false);
            }}
            onCancel={() => setShowMessageDialog(false)}
            showCloseIcon={false}
          />
        </div>
      </div>
    </>
  );
}
