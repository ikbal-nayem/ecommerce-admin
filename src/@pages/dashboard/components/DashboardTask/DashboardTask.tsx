import VerticalTab from "@components/VerticalTab/VerticalTab";
import WxButton from "@components/WxButton";
import WxIcon from "@components/WxIcon/WxIcon";
import {
	PREFERENCES,
	PRODUCT_CREATE,
	THEME_CUSTOMIZATION_SLIDER,
} from "routes/path-name.route";
import { LocalStorageService } from "services/utils/localStorage.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EnterOTPModal from "../../../../@components/EnterOTPModal/EnterOTPModal";
import "./DashboardTask.scss";

interface IDashboardTask {
  otpModal: boolean;
  setOtpModal: Function;
  content: any;
}

const DashboardTask = ({ content, otpModal, setOtpModal }: IDashboardTask) => {
  const [activeTask, setActiveTask] = useState<number>(1);

  const navigate = useNavigate();

  useEffect(() => {
    if (content) {
      const todo = LocalStorageService.get("todo") || content;
      const activeIndex = todo.findIndex((item: any) => item.active) + 1;
      setActiveTask(activeIndex);
    }
  }, [content]);

  if (activeTask > 0) {
    return (
			<>
				<div className="dashboard_task">
					<VerticalTab>
						<VerticalTab.Tablist activeTab={activeTask}>
							{content.map((item, indx) => {
								return (
									<VerticalTab.Tab
										className="wx__d-flex wx__align-items-center "
										id={indx + 1}
										disabled={!item.active}
										key={indx}
									>
										<WxIcon
											className={`tick_icon ${
												item.active ? "text-success" : ""
											}`}
											icon="check_circle_outline"
										/>
										<h6
											className={`wx__text_h6 wx__text_medium wx__mb-0 wx__ms-2 
                ${item?.active ? "text-success" : ""}`}
										>
											{item?.title}
										</h6>
									</VerticalTab.Tab>
								);
							})}

							{/* <VerticalTab.Tab
                className="wx__d-flex wx__align-items-center "
                id={1}
                disabled={content?.isAccountVerified === "YES" ? true : false}
              >
                <WxIcon
                  className={`tick_icon ${
                    content?.isAccountVerified === "NO" ? "text-success" : ""
                  }`}
                  icon="check_circle_outline"
                />
                <h6
                  className={`wx__text_h6 wx__text_medium wx__mb-0 wx__ms-2 
                ${content?.isAccountVerified === "NO" ? "text-success" : ""}`}
                >
                  Verify Account
                </h6>
              </VerticalTab.Tab>
              <VerticalTab.Tab
                className="wx__d-flex wx__align-items-center"
                id={2}
                disabled={content?.needFirstProduct === "NO" ? true : false}
              >
                <WxIcon
                  className={`tick_icon ${
                    content?.needFirstProduct === "YES" ? "text-success" : ""
                  }`}
                  icon="check_circle_outline"
                />
                <h6
                  className={`wx__text_h6 wx__text_medium wx__mb-0 wx__ms-2 ${
                    content?.needFirstProduct === "YES" ? "text-success" : ""
                  }`}
                >
                  Add First Product
                </h6>
              </VerticalTab.Tab> */}

							{/* //////////////////// */}
							{/* TODO:: commented for temporary */}
							{/* //////////////////// */}

							{/* <VerticalTab.Tab
                className="wx__d-flex wx__align-items-center "
                id={3}
                disabled={content?.needMainDomain === "NO" ? true : false}
              >
                <WxIcon
                  className={`tick_icon ${
                    content?.needMainDomain === "YES" ? "text-success" : ""
                  }`}
                  icon="check_circle_outline"
                />
                <h6
                  className={`wx__text_h6 wx__text_medium wx__mb-0 wx__ms-2 ${
                    content?.needMainDomain === "YES" ? "text-success" : ""
                  }`}
                >
                  Add Domain
                </h6>
              </VerticalTab.Tab>
              <VerticalTab.Tab
                className="wx__d-flex wx__align-items-center"
                id={4}
                disabled={content?.needPaymentGateway === "NO" ? true : false}
              >
                <WxIcon
                  className={`tick_icon ${
                    content?.needPaymentGateway === "YES" ? "text-success" : ""
                  }`}
                  icon="check_circle_outline"
                />
                <h6
                  className={`wx__text_h6 wx__text_medium wx__mb-0 wx__ms-2 ${
                    content?.needPaymentGateway === "YES" ? "text-success" : ""
                  }`}
                >
                  Set Up Payment
                </h6>
              </VerticalTab.Tab> */}

							{/* //////////////////// */}
							{/* end */}
							{/* //////////////////// */}

							{/* <VerticalTab.Tab
                className="wx__d-flex wx__align-items-center"
                id={5}
              >
                <WxIcon
                  className={`tick_icon text-success`}
                  icon="check_circle_outline"
                />
                <h6
                  className={`wx__text_h6 wx__text_medium wx__mb-0 wx__ms-2 text-success`}
                >
                  Add Your Logo
                </h6>
              </VerticalTab.Tab>
              <VerticalTab.Tab
                className="wx__d-flex wx__align-items-center"
                id={6}
              >
                <WxIcon
                  className={`tick_icon text-success`}
                  icon="check_circle_outline"
                />
                <h6
                  className={`wx__text_h6 wx__text_medium wx__mb-0 wx__ms-2 text-success`}
                >
                  Add Website Banner
                </h6>
              </VerticalTab.Tab> */}
						</VerticalTab.Tablist>
						<VerticalTab.ContentItems>
							<VerticalTab.Content className="verify_account" id={1}>
								<div className="verify_content_task">
									<h4 className="wx__text_h4 wx__text_medium">
										Verify Account
									</h4>
									<p className="wx__text_body wx__text_regular ">
										Check your inbox with a 6-digit code to verify your account.
										If you can't find the OTP, resend it.
									</p>
									<WxButton
										onClick={() => {
											setOtpModal(true);
											// handleSendOTP(sendingThrough);
										}}
										className="wx__mt-3"
										color="primary"
										variant="fill"
									>
										Send OTP
									</WxButton>
								</div>
							</VerticalTab.Content>
							<VerticalTab.Content id={2}>
								<div className="verify_content_task">
									<h4 className="wx__text_h4 wx__text_medium">
										Add First Product
									</h4>
									<p className="wx__text_body wx__text_regular ">
										Pick your product type, write an excellent description and
										save it!
									</p>
									<WxButton
										onClick={() => navigate(PRODUCT_CREATE)}
										className="wx__mt-3"
										color="primary"
										variant="fill"
									>
										Add Product
									</WxButton>
								</div>
							</VerticalTab.Content>

							{/* //////////////////// */}
							{/* TODO:: commented for temporary */}
							{/* //////////////////// */}

							{/* <VerticalTab.Content id={3}>
                <div className="verify_content_task">
                  <h4 className="wx__text_h4 wx__text_medium">
                    Add Your Domain
                  </h4>
                  <p className="wx__text_body wx__text_regular ">
                    Strengthen your brand by adding a custom domain.
                  </p>
                  <WxButton
                    onClick={() => navigate(SETTINGS_DOMAIN)}
                    className="wx__mt-3"
                    color="primary"
                    variant="fill"
                  >
                    Add Domain
                  </WxButton>
                </div>
              </VerticalTab.Content>
              <VerticalTab.Content id={4}>
                <div className="verify_content_task">
                  <h4 className="wx__text_h4 wx__text_medium">
                    Set Up Payment
                  </h4>
                  <p className="wx__text_body wx__text_regular ">
                    Choose from secure payment providers and link your bank
                    account to accept payments.
                  </p>
                  <WxButton
                    onClick={() => navigate(SETTINGS_PAYMENT)}
                    className="wx__mt-3"
                    color="primary"
                    variant="fill"
                  >
                    Set Up Your Payment
                  </WxButton>
                </div>
              </VerticalTab.Content> */}

							{/* //////////////////// */}
							{/* end */}
							{/* //////////////////// */}

							{/* when commented content will be uncomment then this content id will be 5 */}
							<VerticalTab.Content id={3}>
								<div className="verify_content_task">
									<h4 className="wx__text_h4 wx__text_medium">Add Your Logo</h4>
									<p className="wx__text_body wx__text_regular ">
										Create your own brand identity by adding your company logo.
									</p>
									<WxButton
										onClick={() => navigate(PREFERENCES)}
										className="wx__mt-3"
										color="primary"
										variant="fill"
									>
										Add Logo
									</WxButton>
								</div>
							</VerticalTab.Content>
							{/* when commented content will be uncomment then this content id will be 6 */}
							<VerticalTab.Content id={4}>
								<div className="verify_content_task">
									<h4 className="wx__text_h4 wx__text_medium">
										Add Website Banner
									</h4>
									<p className="wx__text_body wx__text_regular ">
										Add promotional banner images and grab your customer's
										attention fast.
									</p>
									<WxButton
										onClick={() => navigate(THEME_CUSTOMIZATION_SLIDER)}
										className="wx__mt-3"
										color="primary"
										variant="fill"
									>
										Add Banner
									</WxButton>
								</div>
							</VerticalTab.Content>
						</VerticalTab.ContentItems>
					</VerticalTab>
				</div>
				<EnterOTPModal show={otpModal} setShow={setOtpModal} />
			</>
		);
  }
};

export default DashboardTask;
