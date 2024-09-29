import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainXl from "@components/MainContentLayout/WxMainXl";
import WxNotFound from "@components/NotFound/WxNotFound";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import { IDomainSettingsItem } from "@interfaces/Settings.interface";
import { SETTINGS, SETTINGS_DOMAIN_CREATE } from "routes/path-name.route";
import { DomainSettingService } from "services/api/settings/Domain.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DomainListTable from "../../Components/ManageDomainListTable/ManageDomainListTable";

const ManageDomain = () => {
  const [domainList, setDomainList] = useState<IDomainSettingsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const deleteItem = useRef<IDomainSettingsItem | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    getDomainList();
  }, []);

  const getDomainList = () => {
    setIsLoading(true);
    DomainSettingService.getByStoreId({
      body: {},
      meta: {
        offset: 0,
        limit: 30,
        sort: [
          {
            order: "desc",
            field: "isDefault",
          },
        ],
      },
    })
      .then((res) => setDomainList(res.body))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const onMarkAsPrimary = (domain: IDomainSettingsItem) => {
    setIsLoading(true);
    DomainSettingService.makeDomainPrimary({ id: domain?.id })
      .then((res) => {
        ToastService.success(res.message);
        getDomainList();
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsLoading(false));
  };

  const handleDeleteClose = () => {
    setConfirmationModal(false);
    deleteItem.current = null;
  };

  const onDelete = (tempData: IDomainSettingsItem) => {
    deleteItem.current = tempData;
    setConfirmationModal(true);
  };

  const onConfirmDelete = () => {
    setIsLoading(true);
    DomainSettingService.delete({ id: deleteItem.current?.id })
      .then((res) => {
        ToastService.success(res.message);
        const newDomainList = domainList.filter(
          (item) => item.id !== deleteItem.current?.id
        );
        setDomainList([...newDomainList]);
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => {
        setIsLoading(false);
        handleDeleteClose();
      });
  };

  return (
		<WxMainXl>
			<div className="wx__d-flex wx__justify-content-between wx__align-items-center wx__mb-3">
				<WxFormHeader noMargin title="Domain" backNavigationLink={SETTINGS} />
				<WxButton
					variant="fill"
					onClick={() => navigate(SETTINGS_DOMAIN_CREATE)}
				>
					Add Existing Domain
				</WxButton>
			</div>
			{isLoading ? <Preloader absolutePosition /> : null}
			{!isLoading && domainList.length === 0 ? (
				<WxNotFound
					title="No Domain found!"
					btn_link={SETTINGS_DOMAIN_CREATE}
					btn_text="Create Domain"
				/>
			) : null}

			{domainList?.length ? (
				<div className="wx__card">
					<DomainListTable
						onDelete={onDelete}
						domainList={domainList}
						onMarkAsPrimary={onMarkAsPrimary}
					/>
				</div>
			) : null}

			{/* <DomainTableSkelton /> */}

			<ConfirmationModal
				onConfirm={onConfirmDelete}
				isOpen={confirmationModal}
				onClose={handleDeleteClose}
				isSubmitting={isLoading}
				title="Domain Delete Confirmation!"
				body={
					<>
						Do you want to delete <b>{deleteItem.current?.domainAddress}</b>?
						This action will take few moments (usually 1-30 minutes) to remove
						from the entire system.
					</>
				}
			/>
		</WxMainXl>
	);
};

export default ManageDomain;
