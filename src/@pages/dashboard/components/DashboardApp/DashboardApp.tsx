import WxIcon from "@components/WxIcon/WxIcon";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { APP_OVERVIEW } from "routes/path-name.route";
import { useNavigate } from "react-router-dom";
import { imageURLGenerate } from "utils/utils";

const DashboardApp = ({ apps }) => {
  const navigate = useNavigate();

  return (
    <div className="wx__col-md-9">
      <div className="wx__row">
        {apps.slice(0, 2).map((app) => (
          <div
            onClick={() => navigate(APP_OVERVIEW({ id: app.id }))}
            className="wx__col-md-6 wx__col-sm-12 wx__mt-3"
            key={app.id}
          >
            <div className="wx__app_card wx__card">
              <WxThumbnail src={imageURLGenerate(app?.appIconPath)} noBorder />
              <div className="wx__mt-3">
                <h6 className="wx__m-0 wx__text_h6 wx__text_medium wx__text-truncate">
                  {app?.appTitle}
                </h6>
                <span className="wx__text_body wx__text-secondary wx__w-100 wx__d-inline-block wx__text-truncate">
                  {app?.shortDesc}
                </span>
                <div className="wx__d-flex wx__justify-content-between wx__align-items-center wx__mt-2">
                  {app?.avgRating && app?.totalReview && (
                    <div className="wx__d-flex wx__align-items-center">
                      <WxIcon className="star_icon" icon="star" />
                      <span className="wx__text_subtitle wx__text_medium">
                        {app?.avgRating}/5 ({app?.totalReview} Review)
                      </span>
                    </div>
                  )}
                  <span className="app_price wx__text_small wx__text_medium">
                    BDT {app?.recurringAmount}/Month
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* <div className="wx__app_card wx__card">
            <div className="app_img">
              <img src={importerImg} alt="" />
            </div>
            <div className="wx__mt-3">
              <h6 className="wx__m-0 wx__text_h6 wx__text_medium">
                Adding Product Importer
              </h6>
              <span className="wx__text_body wx__text-secondary">
                Copy / Import products from any Shop store. ..
              </span>
              <div className="wx__d-flex wx__justify-content-between wx__align-items-center wx__mt-2">
                <div className="wx__d-flex wx__align-items-center">
                  <WxIcon className="star_icon" icon="star" />
                  <span className="wx__text_subtitle wx__text_medium">
                    4.2/5 (36 Review)
                  </span>
                </div>
                <span className="app_price wx__text_small wx__text_medium">
                  BDT 550/Month
                </span>
              </div>
            </div>
          </div> */}
        {/* <div className="wx__col-md-6 wx__col-sm-12 wx__mt-3">
          <div className="wx__app_card wx__card">
            <div className="app_img">
              <img src={advertiseImg} alt="" />
            </div>
            <div className="wx__mt-3">
              <h6 className="wx__m-0 wx__text_h6 wx__text_medium">
                Adding Product Importer
              </h6>
              <span className="wx__text_body wx__text-secondary">
                Copy / Import products from any Shop store. ..
              </span>
              <div className="wx__d-flex wx__justify-content-between wx__align-items-center wx__mt-2">
                <div className="wx__d-flex wx__align-items-center">
                  <WxIcon className="star_icon" icon="star" />
                  <span className="wx__text_subtitle wx__text_medium">
                    4.2/5 (36 Review)
                  </span>
                </div>
                <span className="app_price wx__text_small wx__text_medium">
                  BDT 550/Month
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardApp;
