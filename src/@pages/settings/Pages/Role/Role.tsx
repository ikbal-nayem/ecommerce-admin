import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import MainLg from "@components/MainContentLayout/MainLg";
import WxNotFound from "@components/NotFound/NotFound";
import { FormHeader } from "@components/FormLayout";
import Pagination from "@components/Pagination";
import { IRequestMeta } from "@interfaces/common.interface";
import { SETTINGS, SETTINGS_ROLES_CREATE } from "routes/path-name.route";
import { AdminService } from "services/api/admin/Admin.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RoleListTable from "../../Components/RoleListTable/RoleListTable";

const Role = () => {
  const [roleList, setRoleList] = useState<any>([]);
  const [roleMeta, setRoleMeta] = useState<IRequestMeta>();
  // pagination states
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page"))
  );
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const deleteItem = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    getRoleList();
  }, [currentPage, paginationLimit]);

  const getRoleList = () => {
    setIsLoading(true);
    AdminService.getMerchantRoleList({
      meta: {
        offset: currentPage,
        limit: paginationLimit,
        sort: [{ field: "createdOn", order: "desc" }],
      },
      body: {},
    })
      .then((resp) => {
        setRoleList(resp.body);
        setRoleMeta(resp.meta);
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsLoading(false));
  };

  const onDelete = (item: string) => {
    deleteItem.current = item;
    setConfirmationModal(true);
  };

  const onDeleteClose = () => {
    deleteItem.current = null;
    setConfirmationModal(false);
  };

  const onConfirmDelete = () => {
    if (!deleteItem.current) return;
    setIsSubmitting(true);
    AdminService.deleteRoleByMerchant({ id: deleteItem.current?.id })
      .then((res) => {
        ToastService.success(res.message);
        getRoleList();
        onDeleteClose();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <MainLg>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <FormHeader title="User Roles" backNavigationLink={SETTINGS} />
          {/* <Button
            variant="fill"
            onClick={() => navigate(SETTINGS_ROLES_CREATE)}
          >
            Add Role
          </Button> */}
        </div>
        {isLoading ? <Preloader absolutePosition /> : null}

        {!isLoading && roleList?.length === 0 ? (
          <WxNotFound
            title="No Role found!"
            btn_link={SETTINGS_ROLES_CREATE}
            btn_text="Create User Role"
          />
        ) : null}

        {roleList?.length ? (
          <div className="card">
            <RoleListTable onDelete={onDelete} roleList={roleList} />
            <div className="px-4 py-3">
              <Pagination
                meta={roleMeta}
              />
            </div>
          </div>
        ) : null}
      </MainLg>
      <ConfirmationModal
        onConfirm={onConfirmDelete}
        isOpen={confirmationModal}
        onClose={onDeleteClose}
        isSubmitting={isSubmitting}
        title="Role Delete Confirmation!"
        body={
          <p>
            Do you want to delete <b>{deleteItem.current?.roleName}</b>? This
            action will delete permanently.
          </p>
        }
      />
    </div>
  );
};

export default Role;
