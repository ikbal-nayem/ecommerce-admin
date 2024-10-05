import {Button} from "@components/Button";
import WxIcon from "@components/Icon";
import WxTag from "@components/WxTag";
import WxThumbnail from "@components/Thumbnail";
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
      <div className="tlibrary-pad d-flex justify-content-between align-items-center mb-2">
        <div className="w-100">
          <h5 className="text_semibold mb-1">Theme Library</h5>
          <p className="text_body">
            This is the theme customers see when they visit your store.
          </p>
        </div>
        <div className="w-100 d-flex justify-content-end">
          <Button variant="outline" onClick={() => navigate(THEMES_LIST)}>
            Explore Themes
          </Button>
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
              className="d-flex justify-content-between"
            >
              <div
                className="left d-flex align-items-center"
                onClick={() => navigate(THEMES_OVERVIEW({ theme_id: item.id }))}
              >
                <WxThumbnail src={imageURLGenerate(item?.themeIcon)} noBorder />
                <div className="tbTitle">
                  <div>
                    <span className="text_subtitle text_semibold">
                      {item?.title}
                    </span>
                    {isInstalled && (
                      <div className="d-inline">
                        <WxTag
                          label="Installed"
                          className="mx-2 mb-2"
                        />
                        {isInstalled?.isActive && (
                          <WxTag
                            label="Published"
                            color="success"
                            className="mx-2 mb-2"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text_subtitle text_regular">
                    {item?.shortDesc}
                  </span>
                </div>
              </div>
              <div className="right d-flex justify-content-end align-items-center">
                <Button
                  variant="none"
                  color="secondary"
                  className="wx_text_regular preview me-2"
                  onClick={() =>
                    navigate(THEMES_OVERVIEW({ theme_id: item.id }))
                  }
                >
                  <WxIcon icon="visibility" className="me-2 mt-auto" />
                  <span>Preview</span>
                </Button>
                {/* <Button
								variant="none"
								className="wx_text_regular ms_2 me-2"
							>
								Customize
							</Button> */}
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
												<li className="text_subtitle">
													<Link to="" className="text_body">
														<WxIcon icon="visibility" />
														View
													</Link>
												</li>
												<li className="text_subtitle">
													<Link to="" className="text_body">
														<WxIcon icon="title" />
														Rename
													</Link>
												</li>
												<li className="text_subtitle">
													<Link to="" className="text_body">
														<WxIcon icon="language" />
														Duplicate Site
													</Link>
												</li>
												<li className="text_subtitle">
													<Link to="" className="text_body">
														<WxIcon icon="download" />
														Download Theme
													</Link>
												</li>
												<li className="text_subtitle">
													<Link to="" className="text_body">
														<WxIcon icon="code" />
														Edit Code
													</Link>
												</li>
												<li className="text_subtitle">
													<Link to="" className="text_body">
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
