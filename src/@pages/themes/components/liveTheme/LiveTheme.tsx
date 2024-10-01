import WxButton from "@components/WxButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IThemeInstalled } from "@interfaces/themeCustomization.interface";
import "./livetheme.scss";
import WxNotFound from "@components/NotFound/WxNotFound";
import { imageURLGenerate } from "utils/utils";
import { THEME_CUSTOMIZATION_SLIDER } from "routes/path-name.route";

type ILiveThemeProps = {
	installedThemes: IThemeInstalled[];
};

const LiveTheme = ({ installedThemes }: ILiveThemeProps) => {
	const [showPopup, setShowPopup] = useState<boolean>(false);
	const navigate = useNavigate();

	const onShowPopup = () => {
		setShowPopup(!showPopup);
	};

	const activeTheme = installedThemes.find((theme) => theme.isActive);

	if (!activeTheme)
		return <WxNotFound title="Oops!" description="No published theme found!" />;

	return (
		<div className="live-theme row">
			<div className="col-md-12 col-sm-12">
				<h5 className="text_semibold">
					Live Theme <i>({activeTheme?.themeRegisterDTO?.title})</i>
				</h5>
				<p className="text_body text_regular">
					{activeTheme?.themeRegisterDTO?.shortDesc}
				</p>
			</div>
			<div className="livetheme-pad col-lg-8 col-md-7 col-sm-12 mt-3">
				<img
					src={imageURLGenerate(
						activeTheme?.themeRegisterDTO?.screenshots?.[0]
					)}
				/>
			</div>
			<div className="livetheme-pad col-lg-4 col-md-5 col-sm-12 mt-3">
				<h5 className="text_semibold mb-0">
					{activeTheme?.themeRegisterDTO?.title}
				</h5>
				<p className="version">
					Total review :{" "}
					<span className="wx__body_medium">
						{activeTheme?.themeRegisterDTO?.totalReview}
					</span>
				</p>
				<p className="text_regular mb-1">
					Avarage rating : {activeTheme?.themeRegisterDTO?.avgRating} / 5
				</p>
				{/* <p className="text_regular mb-4">
					Layout : <span className="wx__body_medium">{layout}</span>
				</p> */}
				<div className="d-flex align-items-center">
					<WxButton
						className="me-2"
						variant="fill"
						onClick={() => {
							navigate(THEME_CUSTOMIZATION_SLIDER);
						}}
					>
						Customize
					</WxButton>
					{/* <WxButton variant="none" onClick={() => onShowPopup()}>
            More
            <WxIcon
              icon="more_vert"
              id="triggerId"
              className="text-primary ms-3"
            />
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
          </WxButton> */}
				</div>
			</div>
		</div>
	);
};

export default LiveTheme;
