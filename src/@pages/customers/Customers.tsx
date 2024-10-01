import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainFull from "@components/MainContentLayout/WxMainFull";
import WxNotFound from "@components/NotFound/WxNotFound";
import WxSelect from "@components/Select/WxSelect";
import TableLoader from "@components/TableLoader/TableLoader";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import WxPagination from "@components/WxPagination/WxPagination";
import ProductTableSkelton from "@components/WxSkelton/ProductTableSkelton";
import { STATUS_CONSTANT } from "config/constants";
import { ICustomerPayload } from "@interfaces/Customer.interface";
import { CUSTOMER_CREATE } from "routes/path-name.route";
import {
  CustomerService,
  ICustomerRequestPayload,
} from "services/api/Customer.service";
import { GroupService, IGroup } from "services/api/Group.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "utils/debouncer";
import CustomerTable from "./components/CustomerTable";

interface CustomerStatusInfo {
  customerId: string;
  status: boolean;
  index: number;
}

const status = [
  { id: 1, text: STATUS_CONSTANT.active },
  { id: 2, text: STATUS_CONSTANT.inactive },
];

export default function Customer() {
  const [customers, setCustomers] = useState<ICustomerPayload[]>([]);

  const [customerMeta, setCustomerMeta] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoader, setIsLoader] = useState<boolean>(true);

  // pagination states
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page"))
      ? Number(searchParams.get("page")) - 1
      : null || 0
  );
  const [paginationLimit, setPaginationLimit] = useState(10);

  // onchange debounce
  const [searchQuery, setSearchQuery] = useState<string>(null);
  let search: string = useDebounce(searchQuery, 500);

  // selected status
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // selected groups
  const [selectedGroups, setSelectedGroups] = useState<any>();

  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const [statusConfirmation, setStatusConfirmation] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletedData, setDeletedData] = useState<any>(null);
  const [statusUpdateInfo, setStatusUpdateInfo] =
    useState<CustomerStatusInfo | null>();

  const navigate = useNavigate();

  useEffect(() => {
    if (!confirmationModal) setDeletedData("");
  }, [confirmationModal]);

  useEffect(() => {
    if (!statusConfirmation) setStatusUpdateInfo(null);
  }, [statusConfirmation]);

  const [groups, setGroups] = useState<IGroup[]>([]);

  useEffect(() => {
    getCustomers();
  }, [selectedGroups, selectedStatus, search, paginationLimit, currentPage]);

  useEffect(() => {
    GroupService.get({})
      .then((res) => setGroups(res.body))
      .catch((err: any) => ToastService.error(err.message));
  }, []);

  const getCustomers = () => {
    setIsLoader(true);
    CustomerService.get({
      body: {
        status: selectedStatus || null,
        groupId: selectedGroups?.id || null,
        name: search || null,
      },
      meta: {
        offset: currentPage,
        limit: paginationLimit,
        sort: [{ order: "desc", field: "createdOn" }],
      },
    })
      .then((res) => {
        setCustomers(res.body);
        setCustomerMeta(res.meta || {});
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          setIsLoader(false);
        }, 700);
      });
  };

  const onDelete = (customer: string) => {
    if (!customer) return;
    setConfirmationModal(true);
    setDeletedData(customer);
  };

  const onConfirmDelete = () => {
    setIsSubmitting(true);

    if (!deletedData.customerId) return;
    CustomerService.delete([deletedData.customerId])
      .then((res) => {
        ToastService.success("Customer deleted successfully");
        getCustomers();
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setConfirmationModal(false));
  };

  const onChangeGroup = (value) => {
    if (!value.target.value) {
      setSelectedGroups(null);
      return;
    }
    setSelectedGroups(JSON.parse(value.target.value));
  };

  const onChangeStatus = (e: any) => {
    const statusName = e.target.value;
    if (!statusName) {
      setSelectedStatus("");
      return;
    }
    setSelectedStatus(statusName);
  };

  const onCustomerStatusUpdate = (index, customerId, status) => {
    if (!customerId) return;
    setStatusConfirmation(true);
    setStatusUpdateInfo({ index, customerId, status });
  };

  const onConfirmStatusUpdate = () => {
    if (!statusUpdateInfo.customerId) {
      ToastService.error("Customer Information is not Valid!");
      setStatusUpdateInfo(null);
      return;
    }
    setIsSubmitting(true);
    const payload: ICustomerRequestPayload = {
      id: statusUpdateInfo.customerId,
      status: statusUpdateInfo.status ? "Active" : "Inactive",
    };
    CustomerService.update(payload)
      .then((res) => {
        ToastService.success("Customer status updated successfully");
        // customers[statusUpdateInfo.index]["status"] = payload.status;
        // setCustomers([...customers]);
        getCustomers();
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => {
        setStatusConfirmation(false);
        setIsSubmitting(false);
      });
  };

  return (
		<WxMainFull>
			<WxFormHeader
				title="Customers"
				rightContent={
					customers.length ? (
						<WxButton variant="fill" onClick={() => navigate(CUSTOMER_CREATE)}>
							Add Customer
						</WxButton>
					) : null
				}
			/>
			{isLoading ? (
				<div className="rounded w-100 bg-white mt-3">
					<ProductTableSkelton viewBox="0 0 600 230" />
				</div>
			) : (
				<div className="card">
					<div className="row p-4 pb-0">
						<div className="col-lg-8 col-md-6 col-sm-12">
							<WxInput
								type="search"
								placeholder="Search Customer"
								startIcon={<WxIcon icon="search" />}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className="col-lg-2 col-md-3 col-sm-12">
							<WxSelect
								placeholder="Select Group"
								valuesKey="object"
								textKey="title"
								options={groups}
								onChange={onChangeGroup}
							/>
						</div>
						<div className="col-lg-2 col-md-3 col-sm-12">
							<WxSelect
								placeholder="Select Status"
								valuesKey="text"
								textKey="text"
								options={status}
								onChange={onChangeStatus}
							/>
						</div>
					</div>
					<TableLoader isLoading={isLoader} />
					{!isLoading && customers.length === 0 ? (
						<WxNotFound
							title="No customer details found!"
							btn_link={CUSTOMER_CREATE}
							btn_text="Create Customer"
						/>
					) : null}

					{customers.length ? (
						<>
							<CustomerTable
								customers={customers}
								onChangeStatus={onCustomerStatusUpdate}
								onDelete={onDelete}
							/>
							<div className="p-4">
								<WxPagination
									meta={customerMeta}
									setCurrentPage={setCurrentPage}
									setPaginationLimit={setPaginationLimit}
								/>
							</div>
						</>
					) : null}
				</div>
			)}
			<ConfirmationModal
				onConfirm={onConfirmDelete}
				isOpen={confirmationModal}
				setIsOpen={setConfirmationModal}
				isSubmitting={isSubmitting}
				title="Customer Delete Confirmation!"
				body={
					<p>
						Do you want to delete <b>{deletedData?.name}</b>? This action will
						delete permanently.
					</p>
				}
			/>
			<ConfirmationModal
				onConfirm={onConfirmStatusUpdate}
				isOpen={statusConfirmation}
				isSubmitting={isSubmitting}
				setIsOpen={setStatusConfirmation}
				title="Status Change"
				confirmType="primary"
				onConfirmLabel="Yes, Change"
				body="Do you want to change the status?"
			/>
		</WxMainFull>
	);
}
