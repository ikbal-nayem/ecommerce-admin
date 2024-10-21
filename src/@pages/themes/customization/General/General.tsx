import WxMainLg from "@components/MainContentLayout/MainLg";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import TextInput from "@components/TextInput";
import Label from "@components/Label";
import { MediaInput } from "@components/MediaInput";
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
				<FormHeader
					title="General"
					rightContent={
						<Button variant="fill" type="submit">
							Save
						</Button>
					}
				/>
				<div className="card p-4">
					<div className="row">
						<div className="col-md-6">
							<TextInput
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
							<Label>Website Logo</Label>
							<MediaInput
								fileList={siteLogo}
								onChange={(image) => handleImageAdd(image, 0)}
								onRemove={() => onImageRemove(0)}
								multiple={false}
							/>
						</div>
						<div className="col-md-6">
							<Label>Fav Icon</Label>
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
