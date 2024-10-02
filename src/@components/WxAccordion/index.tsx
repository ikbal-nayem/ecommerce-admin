import WxIcon from "@components/Icon";
import { Fragment, useState } from "react";
import "./WxAccordion.scss";

interface IWxAccordion {
  data: any[];
  labelKey: string;
  descriptionKey: string;
}

const WxAccordion = ({ data, labelKey, descriptionKey }: IWxAccordion) => {

  const [show, setShow] = useState<number>();

  const setShowFun = (index) => {
    if(show === index){
      setShow(-1)
      return
    }
    setShow(index)
  }

  return (
    <Fragment>
      {data.map((item, index) => {
        return (
					<div className="wx__accordion w-100 mb-3" key={index}>
						<div className="wx__single_accordion">
							<div
								className="wx__accordion_title d-flex align-items-center"
								onClick={() => setShowFun(index)}
							>
								<div
									className={show === index ? "fqa_minus" : "fqa_plus"}
								></div>
								&nbsp; &nbsp;
								<p className="text_body text_medium  mb-0">
									{item[labelKey]}
								</p>
							</div>
							<div
								className={
									show === index
										? "pt-2 wx__accordion_description active wx_d-block"
										: "wx_d-none wx__accordion_description"
								}
							>
								<p className="text_body text_regular mb-0">
									{item[descriptionKey]}
								</p>
							</div>
						</div>
					</div>
				);
      })}
    </Fragment>
  );
};
export default WxAccordion;
