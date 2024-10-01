import WxIcon from "@components/WxIcon/WxIcon";
import React, { useEffect, useState } from "react";
import { imageURLGenerate } from "utils/utils";
import "./WxSlider.scss";

// : IWxImagePopup
const WxNewSlider = ({ imageList, timeInterval = 3000 }) => {
  const [currentImg, setCurrentImg] = useState(imageList[0]?.imgSrc);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    setInterval(() => setCurrentImgFun(1), timeInterval);
  }, []);

  const setCurrentImgFun = (value) => {
    let tempLength = imageList.length;
    setCurrentImgIdx((prevIdx) => {
      if (prevIdx + value < 0) {
        setCurrentImg(imageList[tempLength - 1]?.imgSrc);
        return tempLength - 1;
      } else if (prevIdx + value === tempLength) {
        setCurrentImg(imageList[0]?.imgSrc);
        return 0;
      } else {
        setCurrentImg(imageList[prevIdx + value]?.imgSrc);
        return prevIdx + value;
      }
    });
  };

  return (
    <section className="wx__slider">
      <div className="img-main-section w-100 d-flex wx__align-items-center">
        <div className="left-icon">
          <WxIcon icon="arrow_back_ios" onClick={() => setCurrentImgFun(-1)} />
        </div>
        <div className="img-section w-100">
          <img
          key={currentImgIdx}
            src={currentImg}
            className="w-100"
            alt={"Image #" + currentImgIdx}
          />
        </div>
        <div className="right-icon">
          <WxIcon
            icon="arrow_forward_ios"
            onClick={() => setCurrentImgFun(1)}
          />
        </div>
      </div>
      <div className="slider-img-list w-100">
        {imageList?.map((item, index) => {
          return (
            <div
              className={
                currentImgIdx === index
                  ? "single-image active-image"
                  : "single-image"
              }
            >
              <img src={item?.imgSrc} onClick={()=>{
                setCurrentImgIdx(index);
                setCurrentImg(item?.imgSrc)
              }} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WxNewSlider;
