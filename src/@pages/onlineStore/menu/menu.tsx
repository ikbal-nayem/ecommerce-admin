import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainXl from "@components/MainContentLayout/WxMainXl";
import WxNotFound from "@components/NotFound/NotFound";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import WxPagination from "@components/Pagination";
import { IMenuset } from "@interfaces/OnlineStore.interface";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MENU_CREATE } from "routes/path-name.route";
import { MenuSetService } from "services/api/onlineStore/Menu.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import MenuListTable from "./MenuListTable";

const Menu = () => {
  const [menuSetData, setmenuSetData] = useState<IMenuset[]>([]);

  // pagination states
  const [metaData, setMetaData] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page"))
      ? Number(searchParams.get("page")) - 1
      : null || 0
  );
  const [paginationLimit, setPaginationLimit] = useState(10);
  //
  const [deletedData, setDeletedData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    MenuSetService.getList({
      meta: {
        offset: currentPage,
        limit: paginationLimit,
        sort: [
          {
            order: "desc",
            field: "createdOn",
          },
        ],
      },
    })
      .then((res) => {
        setmenuSetData(res.body);
        setMetaData(res.meta || {});
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDelete = (tempData: string) => {
    if (!tempData) return;
    setConfirmationModal(true);
    setDeletedData(tempData);
  };

  const onConfirmDelete = () => {
    setIsSubmitting(true);
    setIsLoading(false);
    if (!deletedData) return;
    setConfirmationModal(false);
    let data = {
      ids: [],
    };
    data.ids.push(deletedData.id);
    MenuSetService.deleteAll(data)
      .then((res) => {
        if (res.status == 200) {
          ToastService.success(res.message);
          setConfirmationModal(false);
          getList();
        } else ToastService.error(res.message);
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => {
        setConfirmationModal(false);
        setDeletedData("");
        setIsLoading(false);
        setIsSubmitting(false);
      });
  };

  const onConfirmStatusUpdate = (data, index, status) => {
    if (!data.id) {
      ToastService.error("Menu set information is not valid!");
      return;
    }
    data.isActive = status;
    const payload = data;
    MenuSetService.update(payload)
      .then((res) => {
        if (res.status == 200) {
          menuSetData[index].isActive = payload.isActive;
          setmenuSetData([...menuSetData]);
        } else {
          ToastService.error(res.message);
        }
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <WxMainXl>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <FormHeader title="Menu Set" noBack />
          <Button variant="fill" onClick={() => navigate(MENU_CREATE)}>
            Add Menu Set
          </Button>
        </div>

        {isLoading ? (
          <Preloader />
        ) : !menuSetData.length ? (
          <WxNotFound
            title="No menu set found!"
            btn_link={MENU_CREATE}
            btn_text="Create senu set"
          />
        ) : null}

        {menuSetData.length ? (
          <div className="card">
            <div>
              <MenuListTable
                onDelete={onDelete}
                menuSetData={menuSetData}
                onChangeStatus={onConfirmStatusUpdate}
              />
              <div className="p-4">
                <WxPagination
                  meta={metaData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  paginationLimit={paginationLimit}
                  setPaginationLimit={setPaginationLimit}
                />
              </div>
            </div>
          </div>
        ) : null}
      </WxMainXl>
      <ConfirmationModal
        onConfirm={() => onConfirmDelete()}
        isOpen={confirmationModal}
        onClose={() => setConfirmationModal(false)}
        isSubmitting={isSubmitting}
        title="Menuset Delete Confirmation!"
        body={
          <span>
            Do you want to delete <b>{deletedData?.name}</b>? This action will
            delete permanently.
          </span>
        }
      />
    </div>
  );
};

export default Menu;
