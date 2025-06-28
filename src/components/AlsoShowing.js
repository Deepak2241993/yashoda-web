import React, { useState, useEffect, useContext } from "react";
import { Card } from "primereact/card";
import arrowleft from "../../../assets/images/arrow-left.png";
import arrowright from "../../../assets/images/arrow-right.png";
import { SelectButton } from "primereact/selectbutton";
import miv_cinema from "../../../assets/default-images/vertical-poster-cinema.png";
import miv_cinema1 from "../../../assets/default-images/vertical-poster-cinema.svg";
import NowShowingSkeleton from "../../../skeletons/NowShowingSkeleton";
import icon from "../../../assets/banner/video-icon.png";
import ReactPlayer from "react-player";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import { MyContext } from "@/context/ThemeContext";

const AlsoShowing = (movieSessionData) => {
  const { currentPath } = useContext(MyContext);
  const navigate = useNavigate();
  const [nowShowingMovies, setNowShowingMovies] = useState([
    ...movieSessionData.alsoShowing,
  ]);
  const [value3, setValue3] = useState(null);
  const theme = Cookies.get("theme");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(5);
  const [visible, setVisible] = useState(false);
  const [mtrailerurl, setMtrailerurl] = useState();

  // console.log("alsoShowing=>", movieSessionData.alsoShowing)

  useEffect(() => {
    setNowShowingMovies([...movieSessionData.alsoShowing]);
  }, [movieSessionData.alsoShowing]);

  const moviewCard = (data) => {
    const header = (
      <>
        {data.rt ? (
          <span
            className={
              theme === "systemTheme"
                ? "launch-movie-cinema"
                : "launch-movie-cinema"
            }
          >
            {data?.rt}
          </span>
        ) : (
          ""
        )}
        <img
          alt={data.n}
          src={
            data.miv
              ? data.miv
              : theme === "systemTheme"
              ? miv_cinema
              : miv_cinema1
          }
          width={100}
          height={400}
          className="rounded"
        />
      </>
    );

    const subTitle = () => {
      const firstLine = +" " + data.othergenres?.split(",").join(", ");
      return (
        <div>
          <div>
            <span className="text-muted d-flex">
              <span>{data?.ce}</span>
              <span className="d-flex ">
                <span className="n-dots mt-2"></span>{" "}
                <span>{data?.grs?.join(", ")}</span>{" "}
              </span>
            </span>
          </div>
          <div className="lang-also-showing">
            <span>{data?.mfs?.join(", ")}</span>{" "}
          </div>
          <div>{data.lng}</div>
          {data?.mtrailerurl ? <div
            className="icon-trailer"
            onClick={(e) => {
              e.stopPropagation();
              setMtrailerurl(data?.mtrailerurl);
              setVisible(true);
            }}
          >
            <img src={icon} alt="" className="img-fluid" />
          </div> :""}
        </div>
      );
    };
    return (
      <Card
        title={data?.n?.length > 22 ? `${data?.n.substr(0, 22)} ...` : data?.n}
        subTitle={subTitle}
        header={header}
      ></Card>
    );
  };

  const handleLeft = () => {
    if (start > 0) {
      setStart(start - 5);
      setEnd(end - 5);
    }
  };

  const handleRight = () => {
    if (end < nowShowingMovies.length - 1) {
      setStart(start + 5);
      setEnd(end + 5);
    }
  };

  const justifyOptions = [
    {
      icon: "",
      value: "left",
      text: (
        <img
          src={arrowleft}
          alt=""
          className={start === 0 ? "btn-opacity" : ""}
          onClick={handleLeft}
        />
      ),
    },
    {
      icon: "",
      value: "Center",
      text: (
        <img
          src={arrowright}
          alt=""
          className={end >= nowShowingMovies?.length ? "btn-opacity" : ""}
          onClick={handleRight}
        />
      ),
    },
    // {
    //   icon: "",
    //   value: "Right",
    //   text: (
    //     <span onClick={() => hitGa("coming_soon_see_all_click")}>
    //       {" "}
    //       <span className="see-all">See all</span>{" "}
    //       <img src={arrowfull} alt="" className="img-fluid" />
    //     </span>
    //   ),
    // },
  ];

  const justifyTemplate = (option) => {
    return (
      <span>
        <span className="mx-2">{option.text}</span>
        <i className={option.icon}></i>
      </span>
    );
  };

  return (
    <>
      <div className="d-flex justify-content-center ptb-48">
        <div className="container view-container">
          <div className="Also-showing-view  show-in-desktop-view">
            <h3 className="now-head">Also Showing</h3>
            {nowShowingMovies?.length > 5 ? (
              <span className="gap-arrow also-arrow">
                <SelectButton
                  value={value3}
                  options={justifyOptions}
                  onChange={(e) => {
                    setValue3(e.value);
                    console.log("nextBtn", e.value);
                  }}
                  itemTemplate={justifyTemplate}
                  optionLabel="value"
                />
              </span>
            ) : (
              ""
            )}
          </div>
          {nowShowingMovies ? (
            <div className="now-movie show-in-desktop-view">
              {nowShowingMovies &&
                nowShowingMovies.slice(start, end).map((item, idx) => (
                  <div
                    className="now-movies my-2"
                    key={idx}
                    style={
                      currentPath?.split('/')[1][1] === "moviesessions"
                        ? { width: "18%" }
                        : { width: "17.5%" }
                    }
                    onClick={(e) => {
                      let url = `/moviesessions/${Cookies.get(
                        "city"
                      )}/${item.n}/${item.id}`;
                      let url2 = url.replace(/\s/g, "-");
                      e.stopPropagation();
                      navigate(url2);
                    }}
                  >
                    {moviewCard(item)}
                  </div>
                ))}
            </div>
          ) : (
            <NowShowingSkeleton countVal={5} />
          )}
          <div className="also-showing-mobile show-in-mobile-view">
            <div className="Also-playing">
              <h5>You may also like</h5>
            </div>
            <div className="All-poster-show-slide-mobile">
              {nowShowingMovies ? (
                nowShowingMovies?.map((item, idx) => (
                  <div
                    className="lastest-movies-poster-mobile"
                    key={idx}
                    onClick={() => {
                      let url =
                        "/moviesessions/" +
                        Cookies.get("city") +
                        "/" +
                        item.n.replace(/[\s/]/g, "") +
                        "/" +
                        item.id +
                        "?language=" +
                        item.lng;
                      let url2 = url.replace(/\s/g, "-");
                    }}
                  >
                    <img
                      src={
                        item.miv
                          ? item.miv
                          : theme === "systemTheme"
                          ? miv_cinema
                          : miv_cinema1
                      }
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                ))
              ) : (
                <NowShowingSkeleton countVal={2} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="card flex justify-content-center">
        <Dialog
          visible={visible}
          className="tariler-show"
          onHide={() => setVisible(false)}
          draggable={false}
        >
          <ReactPlayer
            controls
            playing={true}
            url={mtrailerurl}
            className="play-trailers"
          />
        </Dialog>
      </div>
    </>
  );
};

export default AlsoShowing;
