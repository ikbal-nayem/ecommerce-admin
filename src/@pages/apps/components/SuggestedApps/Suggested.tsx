import WxIcon from "@components/WxIcon/WxIcon";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { IAppDetails, IInstalledApp } from "@interfaces/app.interface";
import { APP_OVERVIEW } from "routes/path-name.route";
import starIcon from "assets/images/apps_img/star.png";
import { Link } from "react-router-dom";
import { imageURLGenerate } from "utils/utils";
import "./Suggested.scss";

interface ISuggestedAppsProps {
  appListData: IAppDetails[];
  installedApps?: IInstalledApp[];
}

const SuggestedApp = ({ appListData, installedApps }: ISuggestedAppsProps) => {
  return (
    <div className="wx__suggested_app_conponent row">
      {appListData?.map((item, index) => (
        <div
          className="col-lg-4 col-md-6 col-sm-12 wx__mt-3"
          key={index}
        >
          <Link to={APP_OVERVIEW({ id: item?.id })}>
            <div className="single-app rounded">
              {installedApps?.some(
                (installedApp) => installedApp?.appId === item?.id
              ) ? (
                <small className="installed">
                  <WxIcon icon="done_all" /> Installed
                </small>
              ) : null}

              <WxThumbnail src={imageURLGenerate(item?.appIconPath)} noBorder />
              <p className="wx__text-body wx__text_medium wx__mb-0 w-100 d-inline-block text-truncate">
                {item?.appTitle}
              </p>
              <p className="wx__text_subtitle wx__text_regular wx__subtitle wx__mb-3 w-100 d-inline-block text-truncate">
                {item?.shortDesc}
              </p>
              <div className="d-flex wx__justify-content-between wx__align-items-center card__bottom">
                {item?.recurringAmount === 0 ? (
                  <p className="wx__text_regular wx__text_small">
                    Free Plan Available
                  </p>
                ) : (
                  item?.recurringAmount && (
                    <p className="wx__text_regular wx__text_small">
                      {item?.recurringAmount} BDT
                    </p>
                  )
                )}
                {item?.avgRating && item?.totalReview && (
                  <div className=" d-flex wx__justify-content-between wx__align-items-center wx__ms-auto">
                    <p className="wx__text_small wx__text_regular d-flex wx__justify-content-center wx__align-items-center">
                      <img
                        className="wx__icon_star"
                        src={starIcon}
                        alt="icon"
                      />
                      <span>
                        {item?.avgRating}/5 ({item?.totalReview})
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SuggestedApp;
