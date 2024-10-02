import WxMainLg from "@components/MainContentLayout/MainLg";
import WxButton from "@components/Button";
import WXEditor from "@components/WxEditor/WxEditor";
import { WxFormHeader } from "@components/WxFormLayout";
import WxHr from "@components/WxHr";
import TextInput from "@components/TextInput";
import WxSwitch from "@components/WxSwitch";
import WxTabs from "@components/WxTabs/WxTabs";
import { SETTINGS_NOTIFICATION } from "routes/path-name.route";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import "./OrderConfirmation.scss";

const OrderConfirmation = () => {
  const location: any = useLocation();
  const [tabOption] = useState<any>([
    {
      id: 1,
      label: "Email",
    },
    {
      id: 2,
      label: "SMS",
    },
  ]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const { register, handleSubmit } = useForm();
  const [smsBody, setSmsBody] = useState<any>();
  const [emailBody, setEmailBody] = useState<any>();
  useEffect(() => {
    if (location?.state) setActiveTab(parseInt(location.state) - 1);
  }, []);

  const onSubmitHandler = (requestData: any) => {
    if (smsBody) requestData.smsBody = smsBody;
    if (emailBody) requestData.emailBody = emailBody;
    if (!requestData.smsSubject || requestData.smsSubject == "")
      delete requestData.smsSubject;
    if (!requestData.emailSubject || requestData.emailSubject == "")
      delete requestData.emailSubject;

    console.log(requestData);
  };

  return (
		<WxMainLg className="order_confirmation_sec">
			<WxFormHeader
				noMargin
				title="Order placement confirmation"
				backNavigationLink={SETTINGS_NOTIFICATION}
			/>
			<form onSubmit={handleSubmit(onSubmitHandler)}>
				<div className="row">
					<div className="notification_left col-lg-8 col-md-12 col-sm-12 mt-3">
						<div className="card p-4">
							<div className="row">
								<div className="col-md-12 col-sm-12">
									<WxTabs
										option={tabOption}
										labelKey="label"
										currentIndex={activeTab}
										setCurrentIndex={setActiveTab}
									/>
									{activeTab === 1 ? (
										<div className="mt-3">
											<TextInput
												label="SMS Subject"
												isRequired
												type="text"
												registerProperty={{
													...register("smsSubject"),
												}}
											/>
											<div className="body_label">
												<p className="text_subtitle text_semibold">
													SMS Body <span>*</span>
												</p>
											</div>
											<WXEditor onEditorChange={(e) => setSmsBody(e)} />
										</div>
									) : (
										<div className="mt-3">
											<TextInput
												label="Email Subject"
												isRequired
												type="text"
												registerProperty={{
													...register("emailSubject"),
												}}
											/>
											<div className="body_label">
												<p className="text_subtitle text_semibold">
													Email Body <span>*</span>
												</p>
											</div>
											<WXEditor onEditorChange={(e) => setEmailBody(e)} />
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="notification_right col-lg-4 col-md-12 col-sm-12 mt-3">
						<div className="card p-4">
							<WxButton variant="fill" type="submit" className="mb-3">
								Update
							</WxButton>
							<WxButton type="button" variant="outline">
								Preview
							</WxButton>
							<WxHr />
							<div className="d-flex align-items-center justify-content-between pe-5">
								<p className="mb-0">Email</p>
								<WxSwitch
									defaultChecked
									checkedTitle="Active"
									unCheckedTitle="Inactive"
								/>
							</div>

							<div className="d-flex align-items-center justify-content-between pe-5 mt-4">
								<p className="mb-0">SMS</p>
								<WxSwitch
									defaultChecked
									checkedTitle="Active"
									unCheckedTitle="Inactive"
								/>
							</div>
						</div>
					</div>
				</div>
			</form>
		</WxMainLg>
	);
};

export default OrderConfirmation;
