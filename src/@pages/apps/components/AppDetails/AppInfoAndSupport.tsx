import WxIcon from "@components/WxIcon/WxIcon";
import WxTag from "@components/WxTag";
import { generateDateFormat } from "utils/splitDate";

const AppInfoAndSupport = ({ appInfo }) => (
  <>
    <div className="wx__card wx__details_mid_right wx__mt-3 wx__p-4">
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
          <li className="wx__d-flex wx__justify-content-between wx__align-items-center">
            <p className="info_label ">Total User</p>
            <p className="info_value ">{appInfo.totalUsers || 0}</p>
          </li>
          <li className="wx__d-flex wx__justify-content-between wx__align-items-center">
            <p className="info_label ">Total Install</p>
            <p className="info_value ">{appInfo.totalInstalledUser || 0}</p>
          </li>
          <li className="wx__d-flex wx__justify-content-between">
            <p className="info_label ">Tags</p>
            <div className="info_value wx__d-flex wx__flex-wrap wx__justify-content-end wx__gap-1">
              {appInfo?.tags?.split(",")?.map((tag: string) => (
                <div key={tag}>
                  <WxTag label={tag} className="wx__m-0" />
                </div>
              ))}
            </div>
          </li>
        </ul>
      ) : null}
    </div>
    <div className="wx__card wx__details_mid_right wx__p-4 wx__mt-3">
      <h5>Support</h5>
      {appInfo ? (
        <>
          <div className="wx__d-flex wx__align-items-center wx__mb-3">
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
            className="phone wx__d-flex wx__align-items-center"
          >
            <WxIcon icon="phone" variants="filled" />
            &nbsp;
            <span>{appInfo?.developer?.supportPhone}</span>
          </a>
          <a
            href="https://webx.xyz/privacy-policy/"
            target="_blank"
            className="privacy_policy wx__d-flex wx__align-items-center"
          >
            <WxIcon icon="privacy_tip" variants="filled" />
            &nbsp;
            <span>Privacy Policy</span>
          </a>
          <a
            href={"mailto:" + appInfo?.developer?.supportEmail}
            className="mail wx__d-flex wx__align-items-center"
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
