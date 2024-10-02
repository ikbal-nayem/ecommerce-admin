import WxIcon from "@components/Icon";
import WxTag from "@components/WxTag";
import { generateDateFormat } from "utils/splitDate";

const AppInfoAndSupport = ({ appInfo }) => (
  <>
    <div className="card wx__details_mid_right mt-3 p-4">
      <h5>Info</h5>
      {appInfo ? (
        <ul>
          <li className="d-flex justify-content-between align-items-center">
            <p className="info_label ">Version</p>
            <p className="info_value ">{appInfo?.lastVersion}</p>
          </li>
          <li className="d-flex justify-content-between align-items-center">
            <p className="info_label ">First Upload</p>
            <p className="info_value ">
              {generateDateFormat(
                appInfo?.fileUploadDate,
                "%MM% %date%, %yyyy%"
              )}
            </p>
          </li>
          <li className="d-flex justify-content-between align-items-center">
            <p className="info_label ">Last Upload</p>
            <p className="info_value ">
              {appInfo?.lastUploadDate
                ? generateDateFormat(
                    appInfo?.lastUploadDate,
                    "%MM% %date%, %yyyy%"
                  )
                : generateDateFormat(
                    appInfo?.fileUploadDate,
                    "%MM% %date%, %yyyy%"
                  )}
            </p>
          </li>
          <li className="d-flex justify-content-between align-items-center">
            <p className="info_label ">Total User</p>
            <p className="info_value ">{appInfo.totalUsers || 0}</p>
          </li>
          <li className="d-flex justify-content-between align-items-center">
            <p className="info_label ">Total Install</p>
            <p className="info_value ">{appInfo.totalInstalledUser || 0}</p>
          </li>
          <li className="d-flex justify-content-between">
            <p className="info_label ">Tags</p>
            <div className="info_value d-flex flex-wrap justify-content-end gap-1">
              {appInfo?.tags?.split(",")?.map((tag: string) => (
                <div key={tag}>
                  <WxTag label={tag} className="m-0" />
                </div>
              ))}
            </div>
          </li>
        </ul>
      ) : null}
    </div>
    <div className="card wx__details_mid_right p-4 mt-3">
      <h5>Support</h5>
      {appInfo ? (
        <>
          <div className="d-flex align-items-center mb-3">
            <WxIcon
              icon="apartment"
              variants="filled"
              className="email__icon"
            />
            &nbsp;
            {appInfo?.developer?.companyName}
          </div>
          <a
            href={"tel:" + appInfo?.developer?.supportPhone}
            className="phone d-flex align-items-center"
          >
            <WxIcon icon="phone" variants="filled" />
            &nbsp;
            <span>{appInfo?.developer?.supportPhone}</span>
          </a>
          <a
            href="https://webx.xyz/privacy-policy/"
            target="_blank"
            className="privacy_policy d-flex align-items-center"
          >
            <WxIcon icon="privacy_tip" variants="filled" />
            &nbsp;
            <span>Privacy Policy</span>
          </a>
          <a
            href={"mailto:" + appInfo?.developer?.supportEmail}
            className="mail d-flex align-items-center"
          >
            <WxIcon
              icon="markunread"
              variants="filled"
              className="email__icon"
            />
            &nbsp;
            <span>{appInfo?.developer?.supportEmail}</span>
          </a>
        </>
      ) : null}
    </div>
  </>
);

export default AppInfoAndSupport;
