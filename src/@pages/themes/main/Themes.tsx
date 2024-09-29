import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxIcon from "@components/WxIcon/WxIcon";
import {
  ITheme,
  IThemeInstalled,
} from "@interfaces/themeCustomization.interface";
import { ThemeService } from "services/api/onlineStore/themes/Theme.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LiveTheme from "../components/liveTheme/LiveTheme";
import Themelibrary from "../components/themeLibraray/Tlibrary";
import { ENV } from "config/ENV.config";

const Themes = () => {
  const [themeList, setThemeList] = useState<ITheme[]>([]);
  const [installedThemes, setInstalledThemes] = useState<IThemeInstalled[]>([]);
  const [loadingThemeList, setLoadingThemeList] = useState<boolean>(true);
  const [loadingInstalledTheme, setLoadingInstalledTheme] =
    useState<boolean>(true);

  useEffect(() => {
    getInstalledThemes();
    ThemeService.getList({ meta: { limit: 5, offset: 0 } })
      .then((resp) => setThemeList(resp.body))
      .catch((err) => ToastService.error(err.message))
      .finally(() => setLoadingThemeList(false));
  }, []);

  const getInstalledThemes = () => {
    ThemeService.getInstalledTheme({})
      .then((resp) => setInstalledThemes(resp.body))
      .finally(() => setLoadingInstalledTheme(false));
  };

  return (
    <WxMainLg className="theme_page">
      <WxFormHeader
        title="Themes"
        noBack
        rightContent={
          <WxButton
            variant="none"
            color="secondary"
            onClick={() => window.open(ENV.STORE_DOMAIN, "_blank")}
          >
            <WxIcon icon="visibility" className="wx__me-2" />
            view your store
          </WxButton>
        }
      />
      <div className="wx__card wx__p-3">
        {loadingInstalledTheme ? (
          <Preloader />
        ) : (
          <LiveTheme installedThemes={installedThemes} />
        )}
      </div>

      <div className="wx__card wx__p-3 wx__mt-3">
        {themeList.length ? (
          <Themelibrary
            themeList={themeList}
            installedThemes={installedThemes}
          />
        ) : loadingThemeList ? (
          <Preloader />
        ) : (
          <h3 className="wx__text-center">No theme found!</h3>
        )}
      </div>
    </WxMainLg>
  );
};

export default Themes;
