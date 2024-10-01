import WxIcon from "@components/WxIcon/WxIcon";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { IAppDetails, IInstalledApp } from "@interfaces/app.interface";
import { APP_OVERVIEW } from "routes/path-name.route";
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
          className="col-lg-4 col-md-6 col-sm-12 mt-3"
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
              <p className="text-body text_medium mb-0 w-100 d-inline-block text-truncate">
                {item?.appTitle}
              </p>
              <p className="text_subtitle text_regular wx__subtitle mb-3 w-100 d-inline-block text-truncate">
                {item?.shortDesc}
              </p>
              <div className="d-flex justify-content-between align-items-center card__bottom">
                {item?.recurringAmount === 0 ? (
                  <p className="text_regular text_small">
                    Free Plan Available
                  </p>
                ) : (
                  item?.recurringAmount && (
                    <p className="text_regular text_small">
                      {item?.recurringAmount} BDT
                    </p>
                  )
                )}
                {item?.avgRating && item?.totalReview && (
                  <div className=" d-flex justify-content-between align-items-center ms-auto">
                    <p className="text_small text_regular d-flex justify-content-center align-items-center">
                      <img
                        className="wx__icon_star"
                        src="/media/icons/star.png"
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
