import WxButton from "@components/WxButton";
import WxIcon from "@components/WxIcon/WxIcon";
import WxTag from "@components/WxTag";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import {
  ITheme,
  IThemeInstalled,
} from "@interfaces/themeCustomization.interface";
import { THEMES_LIST, THEMES_OVERVIEW } from "routes/path-name.route";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { imageURLGenerate } from "utils/utils";
import "./tlibrary.scss";

type IThemeLibraryProps = {
  themeList: ITheme[];
  installedThemes: IThemeInstalled[];
};

const Themelibrary = ({ themeList, installedThemes }: IThemeLibraryProps) => {
  let navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const onShowPopup = (index: number) => {
    // a trigger id is need to show the popup
    if (selectedIndex === index) {
      setSelectedIndex(0);
      setShowPopup(!showPopup);
      return;
    }
    setSelectedIndex(index);
    setShowPopup(!showPopup);
  };

  return (
    <div className="tlibrary">
      <div className="tlibrary-pad wx__d-flex wx__justify-content-between wx__align-items-center wx__mb-2">
        <div className="wx__w-100">
          <h5 className="wx__text_semibold wx__mb-1">Theme Library</h5>
          <p className="wx__text_body">
            This is the theme customers see when they visit your store.
          </p>
        </div>
        <div className="wx__w-100 wx__d-flex wx__justify-content-end">
          <WxButton variant="outline" onClick={() => navigate(THEMES_LIST)}>
            Explore Themes
          </WxButton>
        </div>
      </div>
      {themeList?.map((item) => {
        const isInstalled = installedThemes?.find(
          (th) => th.themeId === item?.id
        );
        return (
          <div className="single__theme" key={item.id}>
            <div
              key={item?.id}
              className="wx__d-flex wx__justify-content-between"
            >
              <div
                className="left wx__d-flex wx__align-items-center"
                onClick={() => navigate(THEMES_OVERVIEW({ theme_id: item.id }))}
              >
                <WxThumbnail src={imageURLGenerate(item?.themeIcon)} noBorder />
                <div className="tbTitle">
                  <div>
                    <span className="wx__text_subtitle wx__text_semibold">
                      {item?.title}
                    </span>
                    {isInstalled && (
                      <div className="wx__d-inline">
                        <WxTag
                          label="Installed"
                          className="wx__mx-2 wx__mb-2"
                        />
                        {isInstalled?.isActive && (
                          <WxTag
                            label="Published"
                            color="success"
                            className="wx__mx-2 wx__mb-2"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <span className="wx__text_subtitle wx__text_regular">
                    {item?.shortDesc}
                  </span>
                </div>
              </div>
              <div className="right wx__d-flex wx__justify-content-end wx__align-items-center">
                <WxButton
                  variant="none"
                  color="secondary"
                  className="wx_text_regular preview wx__me-2"
                  onClick={() =>
                    navigate(THEMES_OVERVIEW({ theme_id: item.id }))
                  }
                >
                  <WxIcon icon="visibility" className="wx__me-2 wx__mt-auto" />
                  <span>Preview</span>
                </WxButton>
                {/* <WxButton
								variant="none"
								className="wx_text_regular wx__ms-2 wx__me-2"
							>
								Customize
							</WxButton> */}
                {/* <div>
									<WxIcon
										icon="more_vert"
										id="triggerId"
										onClick={() => onShowPopup(index)}
										className="mt-1 preview"
									/>
									{selectedIndex === index && (
										<WxDropdown
											isOpen={showPopup}
											setIsOpen={setShowPopup}
											className="live-theme-drawer"
										>
											<ul>
												<li className="wx__text_subtitle">
													<Link to="" className="wx__text_body">
														<WxIcon icon="visibility" />
														View
													</Link>
												</li>
												<li className="wx__text_subtitle">
													<Link to="" className="wx__text_body">
														<WxIcon icon="title" />
														Rename
													</Link>
												</li>
												<li className="wx__text_subtitle">
													<Link to="" className="wx__text_body">
														<WxIcon icon="language" />
														Duplicate Site
													</Link>
												</li>
												<li className="wx__text_subtitle">
													<Link to="" className="wx__text_body">
														<WxIcon icon="download" />
														Download Theme
													</Link>
												</li>
												<li className="wx__text_subtitle">
													<Link to="" className="wx__text_body">
														<WxIcon icon="code" />
														Edit Code
													</Link>
												</li>
												<li className="wx__text_subtitle">
													<Link to="" className="wx__text_body">
														<WxIcon icon="translate" />
														Edit Language
													</Link>
												</li>
											</ul>
										</WxDropdown>
									)}
								</div> */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Themelibrary;
