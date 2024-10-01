import WxIcon from "@components/WxIcon/WxIcon";
import React, { useEffect, useState } from "react";
import { imageURLGenerate } from "utils/utils";
import "./WxSlider.scss";

interface IWxSlider {
  srcKey: string;
  imageList: any[];
  autoPlay?: boolean;
  timeInterval?: number;
}
// : IWxImagePopup
const WxSlider = ({ srcKey, imageList, timeInterval = 5000, autoPlay = true }: IWxSlider) => {
  const [currentImg, setCurrentImg] = useState<any>(imageList[0][srcKey]);
  const [currentImgIdx, setCurrentImgIdx] = useState<number>(0);

  useEffect(() => {
    if(autoPlay)
      setInterval(()=> setCurrentImgFun(1), timeInterval);
  }, []);

  const setCurrentImgFun = (value) => {
    let tempLength = imageList.length;
    setCurrentImgIdx(prevIdx => {
       if (prevIdx + value < 0) {
      setCurrentImg(imageList[tempLength - 1][srcKey]);
      return(tempLength - 1);
    } else if (prevIdx + value === tempLength) {
      setCurrentImg(imageList[0][srcKey]);
      return(0);
    } else {
      setCurrentImg(imageList[prevIdx + value][srcKey]);
      return(prevIdx + value);
    }
    })
  }
  
  return (
    <section className="wx__slider">
      <div className="img-main-section w-100 d-flex wx__align-items-center">
        <div className="left-icon">
          <WxIcon icon="arrow_back_ios" onClick={() => setCurrentImgFun(-1)} />
        </div>
        <div className="img-section w-100">
          <img src={currentImg instanceof Object ? imageURLGenerate(currentImg) : currentImg} className="w-100" alt={'Image #'+ currentImgIdx} />
        </div>
        <div className="right-icon">
          <WxIcon
            icon="arrow_forward_ios"
            onClick={() => setCurrentImgFun(1)}
          />
        </div>
      </div>
    </section>
  );
};

export default WxSlider;
