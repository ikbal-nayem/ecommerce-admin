import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxInput from "@components/WxInput";
import WxLabel from "@components/WxLabel";
import { MediaInput } from "@components/WxMediaInput";
import { IFilePayload } from "@interfaces/common.interface";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

const imageParams = ["siteLogo", "siteFavicon", "siteSocialImg"];

export default function CustomizationGeneral() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [siteLogo, setSiteLogo] = useState<IFilePayload[] | File[]>([]);
  const [favicon, setFavicon] = useState<IFilePayload[] | File[]>([]);

  const handleImageAdd = useCallback((images: File[], idx) => {
    const setImageState = [setSiteLogo, setFavicon];
    const imgParam: any = imageParams[idx];
    setValue(imgParam, null);
    setImageState[idx](images);
  }, []);

  const onImageRemove = (idx) => {
    const setImageState = [setSiteLogo, setFavicon];
    const imgParam: any = imageParams[idx];
    setValue(imgParam, null);
    setImageState[idx]([]);
  };

  const onSubmit = (requestData) => {
    console.log(requestData);
    console.log(siteLogo, favicon);
  };
  return (
		<WxMainLg>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<WxFormHeader
					title="General"
					rightContent={
						<WxButton variant="fill" type="submit">
							Save
						</WxButton>
					}
				/>
				<div className="card p-4">
					<div className="row">
						<div className="col-md-6">
							<WxInput
								label="Site Title"
								isAutoFocus
								registerProperty={{
									...register("siteTitle", { required: true }),
								}}
								color={errors?.siteTitle ? "danger" : "secondary"}
								errorMessage={errors?.siteTitle && "Title is required!"}
							/>
						</div>
						<div className="col-md-6"></div>

						<div className="col-md-6">
							<WxLabel>Website Logo</WxLabel>
							<MediaInput
								fileList={siteLogo}
								onChange={(image) => handleImageAdd(image, 0)}
								onRemove={() => onImageRemove(0)}
								multiple={false}
							/>
						</div>
						<div className="col-md-6">
							<WxLabel>Fav Icon</WxLabel>
							<MediaInput
								fileList={favicon}
								onChange={(image) => handleImageAdd(image, 1)}
								onRemove={() => onImageRemove(1)}
								multiple={false}
							/>
						</div>
					</div>
				</div>
			</form>
		</WxMainLg>
	);
}
