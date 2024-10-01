import WxSelect from "@components/Select/WxSelect";
import WxButton from "@components/WxButton";
import WxDrawer from "@components/WxDrawer";
import WxDrawerBody from "@components/WxDrawer/WxDrawerBody";
import WxDrawerFooter from "@components/WxDrawer/WxDrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import WxInput from "@components/WxInput";
import WxSwitch from "@components/WxSwitch";
import { IDeliveryZoneItem } from "@interfaces/Settings.interface";
import { DeliverySettingService } from "services/api/settings/Delivery.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./Create.scss";

const countryOptionLocal = [{ countryName: "Bangladesh" }];

const Create = ({ isOpen, handleFormClose, editedData, onDelete }) => {
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IDeliveryZoneItem>();

  useEffect(() => {
    editedData
      ? reset({ ...editedData })
      : reset({
          countryName: "Bangladesh",
          deliveryChargeAmount: 0,
          advanceDeliveryChargeAmount: 0,
          isActive: true,
        });
  }, [editedData]);

  const onSubmitting = (requestData) => {
    setIsSaving(true);
    const requestUrl = editedData
      ? DeliverySettingService.update
      : DeliverySettingService.create;
    requestUrl(requestData)
      .then((res) => {
        ToastService.success(
          `Delivery zone ${editedData ? "updated" : "created"} successfully!`
        );
        handleFormClose(true);
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsSaving(false));
  };

  return (
		<WxDrawer show={isOpen} handleClose={handleFormClose}>
			<div className="delivery_create_sec">
				<WxDrawerHeader
					title={`${editedData ? "Edit" : "Add"} Delivery Zone`}
					closeIconAction={handleFormClose}
				/>
				<form onSubmit={handleSubmit(onSubmitting)} noValidate>
					<WxDrawerBody>
						<div className="row">
							<div className="col-md-12 col-sm-12">
								<WxInput
									isRequired
									label="Delivery Zone Name"
									registerProperty={{ ...register("name", { required: true }) }}
									color={errors?.name ? "danger" : "secondary"}
									errorMessage={errors?.name ? "This field is required!" : ""}
								/>
							</div>
							<div className="col-md-12 col-sm-12">
								<WxInput
									label="Delivery Amount"
									isRequired
									type="number"
									min={0}
									onFocus={(e) => e.target.select()}
									registerProperty={{
										...register("deliveryChargeAmount", {
											required: "Please, provide amount",
											valueAsNumber: true,
										}),
									}}
									color={errors?.deliveryChargeAmount ? "danger" : "secondary"}
									errorMessage={errors?.deliveryChargeAmount?.message}
								/>
							</div>
							<p className="text_subtitle text_regular">
								System will auto detect “0” as free delivery
							</p>
							<div className="col-md-12 col-sm-12 mt-2">
								<WxSelect
									label="Country"
									isRequired
									isDisabled
									valuesKey="countryName"
									textKey="countryName"
									options={countryOptionLocal}
									registerProperty={{ ...register("countryName") }}
								/>
							</div>
							<div className="mt-4" style={{ maxWidth: "90%" }}>
								<WxSwitch
									label="Prebooking"
									checkedTitle="Yes"
									unCheckedTitle="No"
									registerProperty={{ ...register("hasAdvanceCharge") }}
								/>
							</div>
							{watch("hasAdvanceCharge") ? (
								<div className="col-md-12 col-sm-12 mt-3">
									<WxInput
										isRequired
										label="Set Prebooking Amount"
										noMargin
										type="number"
										min={0}
										onFocus={(e) => e.target.select()}
										registerProperty={{
											...register("advanceDeliveryChargeAmount", {
												valueAsNumber: true,
											}),
										}}
									/>
								</div>
							) : null}

							<div className="mt-4" style={{ maxWidth: "90%" }}>
								<WxSwitch
									label="Status"
									checkedTitle="Active"
									unCheckedTitle="Inactive"
									registerProperty={{ ...register("isActive") }}
								/>
							</div>
						</div>
					</WxDrawerBody>
					<WxDrawerFooter>
						<div className="delivery_create_sec__footer">
							{editedData ? (
								<WxButton
									color="danger"
									variant="fill"
									onClick={() => onDelete(editedData)}
								>
									Delete
								</WxButton>
							) : null}
							<div className="ms-auto d-flex">
								<WxButton
									color="secondary"
									type="button"
									variant="outline"
									className="me-2"
									onClick={handleFormClose}
									disabled={isSaving}
								>
									Cancel
								</WxButton>
								<WxButton variant="fill" type="submit" disabled={isSaving}>
									{editedData ? "Save Changes" : "Add Delivery Zone"}
								</WxButton>
							</div>
						</div>
					</WxDrawerFooter>
				</form>
			</div>
		</WxDrawer>
	);
};
export default Create;
