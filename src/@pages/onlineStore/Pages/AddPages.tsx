import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxButton from "@components/WxButton";
import WXEditor from "@components/WxEditor/WxEditor";
import WxFormHeader from "@components/WxFormLayout/WxFormHeader";
import WxHr from "@components/WxHr";
import WxInput from "@components/WxInput";
import WxSwitch from "@components/WxSwitch";
import { IPagesSettings } from "@interfaces/Settings.interface";
import { ENV } from "config/ENV.config";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { PAGES } from "routes/path-name.route";
import { PagesSettingService } from "services/api/settings/Pages.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import useDebounce from "utils/debouncer";
import makeSlug from "utils/make-slug";

const AddPage = () => {
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const prevSlug = useRef<string>("");
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors, isValid },
		setError,
		clearErrors,
		reset,
	} = useForm<IPagesSettings>({ mode: "onChange" });

	const { id } = useParams();

	useEffect(() => {
		if (id) {
			setIsLoading(true);
			PagesSettingService.getById(id)
				.then((res) => {
					prevSlug.current = res.body?.slug;
					reset(res.body);
				})
				.finally(() => setIsLoading(false));
		}
	}, [id]);

	const watch_title = watch("title");
	const slug = useDebounce(makeSlug(watch("slug")), 500);

	useEffect(() => {
		!id && setValue("slug", makeSlug(watch_title));
	}, [watch_title, id]);

	useEffect(() => {
		slug &&
			prevSlug.current !== slug &&
			PagesSettingService.isSlugAvailable(slug).then((resp) => {
				if (resp.body) {
					clearErrors("slug");
					return;
				}
				setError("slug", { message: resp.message, type: "isExists" });
			});
	}, [slug]);

	const onSubmitting = (requestData) => {
		setIsSaving(true);
		const requestService = id
			? PagesSettingService.update
			: PagesSettingService.create;
		requestService(requestData)
			.then((response) => {
				ToastService.success(response.message);
				navigate(PAGES);
			})
			.catch((err) => {
				ToastService.error(err.message);
			})
			.finally(() => setIsSaving(false));
	};

	if (isLoading) return <Preloader absolutePosition size={50} />;

	return (
		<WxMainLg>
			<WxFormHeader
				noMargin
				title={id ? "Update Page" : "Add Page"}
				backNavigationLink={PAGES}
			/>
			<form onSubmit={handleSubmit(onSubmitting)} noValidate>
				<div className="wx__row">
					<div className="wx__col-lg-8 wx__col-md-7 wx__col-sm-12 ">
						<div className="wx__card wx__p-3 wx__mt-4">
							<WxInput
								label="Page title"
								isRequired
								registerProperty={{
									...register("title", { required: true }),
								}}
								color={errors?.title ? "danger" : "secondary"}
								errorMessage={errors?.title && errors.title.message}
							/>
							<WxInput
								label="Page url"
								isRequired
								registerProperty={{
									...register("slug", { required: true }),
								}}
								helpText={`${ENV.STORE_DOMAIN?.split("/admin")[0]}/pages/${slug}`}
								color={errors?.slug ? "danger" : "secondary"}
								errorMessage={
									errors?.slug && (errors.slug?.message || "Slug is required!")
								}
							/>
							<Controller
								control={control}
								name="description"
								render={({
									field: { onChange, value },
									fieldState: { error },
								}) => (
									<WXEditor
										label="Description"
										noMargin
										defaultValue={value}
										onEditorChange={onChange}
										color={error ? "danger" : "secondary"}
										errorMessage={error && error?.message}
									/>
								)}
								// rules={{ required: true }}
							/>
							{/* <WxInput
								label="Page tags"
								isRequired
								registerProperty={{
									...register("tags", { required: true }),
								}}
								helpText="Use comma(,) to seperate the tags (eg: tag1, tag2, tag3)"
								color={errors?.tags ? "danger" : "secondary"}
								errorMessage={errors?.tags && "First Name is required!"}
							/> */}
						</div>
					</div>
					<div className="wx__col-lg-4 wx__col-md-5 wx__col-sm-12">
						<div className="wx__card wx__p-3 wx__mt-4 wx__form_right">
							<WxButton
								type="submit"
								variant="fill"
								disabled={isSaving || !isValid}
							>
								{isSaving ? <Preloader /> : "Save Page"}
							</WxButton>
							<WxHr />
							<div style={{ maxWidth: "80%" }}>
								<div>
									<WxSwitch
										label={
											<div className="wx__d-flex wx__align-items-center">
												&nbsp; <span>Publish</span>
											</div>
										}
										defaultChecked
										checkedTitle="Yes"
										unCheckedTitle="No"
										registerProperty={{
											...register("isActive"),
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</WxMainLg>
	);
};

export default AddPage;