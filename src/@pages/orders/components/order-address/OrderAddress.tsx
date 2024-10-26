import {Button} from "@components/Button";
import Drawer from "@components/Drawer";
import DrawerBody from "@components/Drawer/DrawerBody";
import DrawerFooter from "@components/Drawer/DrawerFooter";
import DrawerHeader from "@components/Drawer/DrawerHeader";
import { IAddressesPayload } from "@interfaces/Customer.interface";
import { AddressForm } from "@pages/customers/components/AddressMange/AddressFrom";
import { CustomerService } from "services/api/Customer.service";
import { LocationService } from "services/api/Location.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./OrderAddress.scss";

type OrderAddressProps = {
	drawerOpen?: boolean;
	handleClose?: () => void;
	customerId: string;
	selectedAddress?: IAddressesPayload;
	onAddressChange?: (address: IAddressesPayload) => void;
	isUpdating?: boolean;
};

const OrderAddress = ({
	drawerOpen,
	handleClose,
	customerId,
	selectedAddress,
	onAddressChange,
	isUpdating,
}: OrderAddressProps) => {
	const [divisions, setDivision] = useState<any[]>([]);
	const [districts, setDistricts] = useState<any[]>([]);

	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
		reset,
	} = useForm();

	useEffect(() => {
		LocationService.getDivision("19").then((res) => {
			setDivision(res.body);
		});
	}, []);

	useEffect(() => {
		setDefaultValues(selectedAddress);
		return () => reset({});
	}, [selectedAddress]);

	// const getCustomerAddress = () => {
	// 	CustomerService.getAddress({
	// 		body: { customer: { id: customerId } },
	// 	})
	// 		.then((res) => {
	// 			// selectedCustomer.address = res.body;
	// 			// setSelectedCustomer(selectedCustomer);
	// 		})
	// 		.catch((err) => {});
	// };

	const setDefaultValues = (data: any) => {
		const findDivision = divisions.find(
			(item) => item.division_name_eng === data?.state
		);

		if (findDivision) getDistricts(findDivision.division_id);
		reset(data);
		setValue("state", findDivision ? JSON.stringify(findDivision) : "");
		// setEditData(data);
	};

	const onChangeDivision = (divisionInfo: any) => {
		if (!divisionInfo) return;
		divisionInfo = JSON?.parse(divisionInfo);
		if (!divisionInfo.division_id)
			ToastService.error("Please select valid Division or state");
		setValue("state", divisionInfo ? JSON.stringify(divisionInfo) : "");
		setValue("cityName", "");
		getDistricts(divisionInfo.division_id);
	};

	const getDistricts = (divisionID) => {
		LocationService.getDistrict("19", divisionID).then((res) => {
			setDistricts(res.body);
		});
	};

	const handleSave = (data: any) => {
		data.state = data.state ? JSON.parse(data.state).division_name_eng : "";
		onAddressChange(data);
	};

	return (
		<Drawer show={drawerOpen} handleClose={handleClose}>
			<div className="wx__order_address">
				<DrawerHeader title="Order Address" onClickClose={handleClose} />
				<form onSubmit={handleSubmit(handleSave)} noValidate>
					<DrawerBody>
						<AddressForm
							errors={errors}
							register={register}
							divisions={divisions}
							districts={districts}
							onChangeDivision={onChangeDivision}
							control={control}
						/>
					</DrawerBody>
					<DrawerFooter>
						<div className="wx__order_address__footer">
							<Button
								type="button"
								className="me-3"
								variant="outline"
								color="secondary"
								onClick={handleClose}
								disabled={isUpdating}
							>
								Cancel
							</Button>
							<Button type="submit" variant="fill" disabled={isUpdating}>
								{isUpdating ? <Preloader /> : "Save"}
							</Button>
						</div>
					</DrawerFooter>
				</form>
			</div>
		</Drawer>
	);
};

export default OrderAddress;
