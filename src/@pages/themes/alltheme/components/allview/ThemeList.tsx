import WxIcon from "@components/WxIcon/WxIcon";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import {
  ITheme,
  IThemeInstalled,
} from "@interfaces/themeCustomization.interface";
import { THEMES_OVERVIEW } from "routes/path-name.route";
import { Link } from "react-router-dom";
import { imageURLGenerate } from "utils/utils";
import "./ThemeList.scss";

type IAllThemeProps = {
  themeList: ITheme[];
  installedThemes?: IThemeInstalled[];
};

const ThemeList = ({ themeList, installedThemes }: IAllThemeProps) => {
  return (
    <div className="row theme-group">
      {themeList?.map((item: any, index: number) => {
        const installed = installedThemes?.find(
          (th) => th?.themeId === item?.id
        );
        return (
          <div
            key={index}
            className="single-theme col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-4"
          >
            <Link to={THEMES_OVERVIEW({ theme_id: item?.id })}>
              <div className="card theme-card">
                {installed ? (
                  <small className="installed">
                    {installed?.isActive && (
                      <>
                        <WxIcon icon="cloud_done" /> Publihsed&nbsp;&nbsp;
                      </>
                    )}
                    <WxIcon icon="done_all" /> Installed
                  </small>
                ) : null}

                <WxThumbnail
                  src={imageURLGenerate(item?.themeIcon)}
                  noBorder
                  height={100}
                  width={100}
                />
                <strong className="mt-2 text-body text_medium w-100 d-inline-block text-truncate">
                  {item?.title}
                </strong>
                <p className="text_subtitle text_regular wx__subtitle mb-3 w-100 d-inline-block text-truncate">
                  {item?.shortDesc}
                </p>
                <div className="d-flex align-items-center justify-content-between">
                  {item?.currencyCode && item?.price && (
                    <div className="theme_price">
                      <p className="text_subtitle">
                        {item?.currencyCode} {item?.price}
                      </p>
                    </div>
                  )}
                  {!!item?.avgRating && !!item?.totalReview && (
                    <div className="theme-rating ms-auto">
                      <WxIcon icon="star" className="star-color" />
                      <p className="text_small m-0">
                        {item?.avgRating}/5 ({item?.totalReview})
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ThemeList;
