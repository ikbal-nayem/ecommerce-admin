import WxTag from "@components/WxTag";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { useNavigate } from "react-router-dom";
import { imageURLGenerate } from "utils/utils";

interface ICourier {
  configuredCourierList: any[];
  supportedCourierList: any[];
  setOpenECourierDrawer: Function;
  getFromDataDrawer: Function;
  configureFrom: any;
  setEditDrawer: Function;
}

const CouriersList = ({
  configuredCourierList,
  supportedCourierList,
  setOpenECourierDrawer,
  configureFrom,
  getFromDataDrawer,
  setEditDrawer,
}: ICourier) => {
  const navigate = useNavigate();

  const { setValue } = configureFrom;

  return (
    <div className="wx__courier_main">
      <div className="card wx__p-3 wx__mt-3">
        <h6 className="wx__text_heading wx__text_semibold wx__mb-0">
          Configured Courier list
        </h6>
        {configuredCourierList?.length ? (
          <ul className="form_group form_group-flush wx__mt-3">
            {configuredCourierList?.map((item) => (
              <li
                className="form_group-item form_group-item-action"
                key={item?.id}
              >
                <div
                  onClick={() => {
                    setValue("courierProvider", item?.courierProvider);
                    setEditDrawer(true);
                    getFromDataDrawer(item?.courierProvider);
                  }}
                  className="wx__text-decoration-none"
                >
                  <div className="d-flex wx__justify-content-between wx__align-items-center">
                    <div className="d-flex wx__align-items-center">
                      <WxThumbnail
                        src={imageURLGenerate(item.banner)}
                        noBorder
                      />
                      <span className="wx__text-dark wx__ms-3">
                        {item?.title}
                      </span>
                    </div>
                    <div className="d-flex wx__align-items-center">
                      <WxTag
                        label={item?.isActive ? "Active" : "Inactive"}
                        color={item?.isActive ? "success" : "default"}
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <h3 className="wx__text-danger wx__text-center wx__my-3">
            No configured courier
          </h3>
        )}
      </div>
      <div className="card wx__p-3 wx__mt-3">
        <h6 className="wx__text_heading wx__text_semibold wx__mb-0">
          Supported Courier list
        </h6>
        {supportedCourierList.length ? (
          <ul className="form_group form_group-flush wx__mt-3">
            {supportedCourierList?.map((item) => (
              <li
                className={`form_group-item form_group-item-action ${
                  item?.isAvailable ? "" : "disable-li"
                }`}
                key={item?.id}
                style={{
                  pointerEvents: item?.isAvailable ? "unset" : "none",
                }}
                onClick={() => {
                  setValue("courierProvider", item?.metaKey);
                  setOpenECourierDrawer(true);
                  setEditDrawer(false);
                }}
              >
                {item?.courierProvider}
                <div className="wx__text-decoration-none">
                  <div className="d-flex wx__justify-content-between wx__align-items-center">
                    <div className="d-flex wx__align-items-center">
                      <WxThumbnail
                        src={imageURLGenerate(item.banner)}
                        noBorder
                      />
                      <span className="wx__text-dark wx__ms-3">
                        {item.title}
                      </span>
                    </div>
                    <div className="d-flex">
                      {item?.isAvailable || (
                        <WxTag label={"Comming soon"} color={"warning"} />
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <h3 className="wx__text-danger wx__text-center wx__my-3">
            No supported courier
          </h3>
        )}
      </div>
    </div>
  );
};

export default CouriersList;
