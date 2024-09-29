import WxImg from "@components/WxImg/WxImg";
import defaultImg from "../../assets/images/defaultImg.webp";
import "./WxThumbnail.scss";

interface IProps {
  src?: any;
  name?: String;
  width?: number;
  height?: number;
  priority?: "name" | "image";
  noBorder?: boolean;
  className?: string;
}

const WxThumbnail = ({
  src = defaultImg,
  name,
  width,
  height,
  priority = "image",
  noBorder = false,
  className,
}: IProps) => {
  var matches = name?.match(/\b(\w)/g);
  var acronym = matches?.join("").toUpperCase();

  return (
    <div
      className={`wx__thumbnail ${noBorder ? "no_border" : ""} ${
        className ? className : ""
      }`}
    >
      {priority === "name" && name ? (
        <span>{acronym}</span>
      ) : (
        priority === "image" && (
          <WxImg
            width={width}
            height={height}
            src={src ? src : defaultImg}
            alt="img"
          />
        )
      )}
    </div>
  );
};

export default WxThumbnail;
