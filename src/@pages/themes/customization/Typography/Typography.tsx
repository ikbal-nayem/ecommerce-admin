import WxMainLg from "@components/MainContentLayout/MainLg";
import WxSelect from "@components/Select/Select";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import WxHr from "@components/WxHr";
import { ThemeCustomizationService } from "services/api/settings/ThemeCustomization.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./Typography.scss";

const fontStyle = [
  {
    text: "Inherit",
    value: "inherit",
  },
  {
    text: "Initial",
    value: "initial",
  },
  {
    text: "Italic",
    value: "italic",
  },
  {
    text: "Normal",
    value: "normal",
  },
];

const fontFamily = [
  {
    text: "Roboto",
    value: "Roboto",
  },
  {
    text: "Poppins",
    value: "Poppins",
  },
  {
    text: "Clicker Script",
    value: "Clicker Script",
  },
  {
    text: "Mouse Memoirs",
    value: "Mouse Memoirs",
  },
  {
    text: "Monsieur La Doulaise",
    value: "Monsieur La Doulaise",
  },
];
const fontWeight = [
  {
    text: "lighter",
    value: "lighter",
  },
  {
    text: "100",
    value: "100",
  },
  {
    text: "200",
    value: "200",
  },
  {
    text: "300",
    value: "300",
  },
  {
    text: "400",
    value: "400",
  },
  {
    text: "500",
    value: "500",
  },
  {
    text: "600",
    value: "600",
  },
  {
    text: "700",
    value: "700",
  },
  {
    text: "800",
    value: "800",
  },
  {
    text: "900",
    value: "900",
  },
  {
    text: "Bold",
    value: "Bold",
  },
  {
    text: "Bolder",
    value: "Bolder",
  },
  {
    text: "Normal",
    value: "Normal",
  },
];

export default function CustomizationTypography() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getTypography();
  }, []);

  const onSubmit = (requestData) => {
    console.log(requestData);
    ThemeCustomizationService.saveTypography(requestData)
      .then((res) => {
        ToastService.success(res.message);
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const getTypography = () => {
    ThemeCustomizationService.getThemeSettings()
      .then((res) => {
        reset({ ...res?.body?.typography });
      })
      .finally(() => setIsLoading(false));
  };

  return (
		<WxMainLg className="typography">
			{isLoading && <Preloader />}
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<FormHeader
					title="Typography"
					rightContent={
						<Button variant="fill" type="submit">
							Save
						</Button>
					}
				/>
				<div className="card p-4">
					<div className="row">
						<strong>Title</strong>
						<div className="col-md-4 col-sm-6 mt-2">
							<WxSelect
								label="Font Family"
								noMargin
								options={fontFamily}
								placeholder="Select"
								valuesKey="value"
								textKey="text"
								registerProperty={{
									...register("title.fontFamily", { required: false }),
								}}
							/>
						</div>
						<div className="col-md-4 col-sm-6 mt-2">
							<WxSelect
								label="Font Style"
								noMargin
								options={fontStyle}
								placeholder="Select"
								valuesKey="value"
								textKey="text"
								registerProperty={{
									...register("title.fontStyle", { required: false }),
								}}
							/>
						</div>
						<div className="col-md-4 col-sm-6 mt-2">
							<WxSelect
								label="Font Weight"
								noMargin
								options={fontWeight}
								placeholder="Select"
								valuesKey="value"
								textKey="text"
								registerProperty={{
									...register("title.fontWeight", { required: false }),
								}}
							/>
						</div>
						<div className="col-md-12">
							<WxHr />
							<strong>Body</strong>
						</div>
						<div className="col-md-4 col-sm-6 mt-2">
							<WxSelect
								label="Font Family"
								noMargin
								options={fontFamily}
								placeholder="Select"
								valuesKey="value"
								textKey="text"
								registerProperty={{
									...register("body.fontFamily", { required: false }),
								}}
							/>
						</div>
						<div className="col-md-4 col-sm-6 mt-2">
							<WxSelect
								label="Font Style"
								noMargin
								options={fontStyle}
								placeholder="Select"
								valuesKey="value"
								textKey="text"
								registerProperty={{
									...register("body.fontStyle", { required: false }),
								}}
							/>
						</div>

						<div className="col-md-4 col-sm-6 mt-2">
							<WxSelect
								label="Font Weight"
								noMargin
								options={fontWeight}
								placeholder="Select"
								valuesKey="value"
								textKey="text"
								registerProperty={{
									...register("body.fontWeight", { required: false }),
								}}
							/>
						</div>
					</div>
				</div>
			</form>
		</WxMainLg>
	);
}
