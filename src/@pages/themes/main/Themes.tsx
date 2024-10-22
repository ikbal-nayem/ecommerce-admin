import MainLg from "@components/MainContentLayout/MainLg";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import Icon from "@components/Icon";
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
    <MainLg className="theme_page">
      <FormHeader
        title="Themes"
        noBack
        rightContent={
          <Button
            variant="none"
            color="secondary"
            onClick={() => window.open(ENV.STORE_DOMAIN, "_blank")}
          >
            <Icon icon="visibility" className="me-2" />
            view your store
          </Button>
        }
      />
      <div className="card p-3">
        {loadingInstalledTheme ? (
          <Preloader />
        ) : (
          <LiveTheme installedThemes={installedThemes} />
        )}
      </div>

      <div className="card p-3 mt-3">
        {themeList.length ? (
          <Themelibrary
            themeList={themeList}
            installedThemes={installedThemes}
          />
        ) : loadingThemeList ? (
          <Preloader />
        ) : (
          <h3 className="text-center">No theme found!</h3>
        )}
      </div>
    </MainLg>
  );
};

export default Themes;
