import WxMainLg from "@components/MainContentLayout/MainLg";
import {Button} from "@components/Button";
import { WxFormHeader } from "@components/WxFormLayout";
import TextInput from "@components/TextInput";
import { ThemeCustomizationService } from "services/api/settings/ThemeCustomization.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import FB from "../../../../assets/images/social/fb.svg";
import Instagram from "../../../../assets/images/social/instagram.svg";
import Linkedin from "../../../../assets/images/social/linkedin.svg";
import Tiktok from "../../../../assets/images/social/tiktok.svg";
import Twitter from "../../../../assets/images/social/twitter.svg";
import Youtube from "../../../../assets/images/social/youtube.svg";

interface ISocial {
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
}

export default function CustomizationSocial() {
  const { register, handleSubmit, reset } = useForm();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		getSocialLinks();
	}, []);

	const onSubmit = (data: ISocial) => {
		setIsLoading(true);
		Object.keys(data).forEach((key) => {
			if (!data[key]) data[key] = null;
		});
		ThemeCustomizationService.saveSocialLink(data)
			.then((res) => {
				ToastService.success(res.message);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsLoading(false));
	};

	const getSocialLinks = () => {
		ThemeCustomizationService.getThemeSettings()
			.then((res) => {
				reset({ ...res?.body?.socialPage });
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<WxMainLg className="social-sec">
			{isLoading && <Preloader />}
			<form onSubmit={handleSubmit(onSubmit)}>
				<WxFormHeader
					title="Social Media"
					rightContent={
						<Button variant="fill" type="submit">
							Save
						</Button>
					}
				/>
				<div className="card p-4">
					<div className="row">
						<div className="col-md-6 mb-4">
							<TextInput
								label="Facebook Link"
								type="url"
								noMargin
								startIcon={
									<img className="input-start-image" src={FB} alt="fb" />
								}
								registerProperty={{
									...register("facebook", { required: false }),
								}}
							/>
						</div>
						<div className="col-md-6 mb-4">
							<TextInput
								label="Instagram Link"
								type="url"
								noMargin
								startIcon={
									<img
										className="input-start-image"
										src={Instagram}
										alt="instagram"
									/>
								}
								registerProperty={{
									...register("instagram", { required: false }),
								}}
							/>
						</div>
						<div className="col-md-6 mb-4">
							<TextInput
								label="Youtube Link"
								type="url"
								noMargin
								startIcon={
									<img
										className="input-start-image"
										src={Youtube}
										alt="youtube"
									/>
								}
								registerProperty={{
									...register("youtube", { required: false }),
								}}
							/>
						</div>
						<div className="col-md-6 mb-4">
							<TextInput
								label="Tiktok Link"
								type="url"
								noMargin
								startIcon={
									<img
										className="input-start-image"
										src={Tiktok}
										alt="tiktok"
									/>
								}
								registerProperty={{
									...register("tiktok", { required: false }),
								}}
							/>
						</div>
						<div className="col-md-6 mb-4">
							<TextInput
								label="Linkedin Link"
								type="url"
								noMargin
								startIcon={
									<img
										className="input-start-image"
										src={Linkedin}
										alt="linkedin"
									/>
								}
								registerProperty={{
									...register("linkedin", { required: false }),
								}}
							/>
						</div>
						<div className="col-md-6 mb-4">
							<TextInput
								label="Twitter Link"
								type="url"
								noMargin
								startIcon={
									<img
										className="input-start-image"
										src={Twitter}
										alt="twitter"
									/>
								}
								registerProperty={{
									...register("twitter", { required: false }),
								}}
							/>
						</div>
					</div>
				</div>
			</form>
		</WxMainLg>
	);
}
