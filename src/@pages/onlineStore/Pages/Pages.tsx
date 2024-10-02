import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainFull from "@components/MainContentLayout/WxMainFull";
import WxNotFound from "@components/NotFound/NotFound";
import WxButton from "@components/Button";
import { WxFormHeader } from "@components/WxFormLayout";
import WxPagination from "@components/WxPagination/WxPagination";
import { IPagesSettings } from "@interfaces/Settings.interface";
import { PAGES_CREATE } from "routes/path-name.route";
import { PagesSettingService } from "services/api/settings/Pages.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setGlobCustomerList } from "store/reducers/utileReducer";
import { dispatch } from "store/store";
import PageTable from "./components/PageTable";

const Pages = () => {
  const [pages, setPages] = useState<IPagesSettings[]>([]);

  const [pageMeta, setPageMeta] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // pagination states
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page"))
      ? Number(searchParams.get("page")) - 1
      : null || 0
  );
  const [paginationLimit, setPaginationLimit] = useState(10);

  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const deleteItem = useRef<IPagesSettings | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    getPageList();
  }, [paginationLimit, currentPage]);

  const getPageList = () => {
    setIsLoading(true);
    PagesSettingService.getList({
      body: {},
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
        setPages(res.body);
        setPageMeta(res.meta || {});
        setIsLoading(false);
        dispatch(setGlobCustomerList(res.body));
      })
      .catch((err) => {
        ToastService.error(err.message);
        setIsLoading(false);
      });
  };

  const onDelete = (page: IPagesSettings) => {
    if (!page) return;
    deleteItem.current = page;
    setConfirmationModal(true);
  };

  const onCloseConfirm = () => {
    setConfirmationModal(false);
    deleteItem.current = null;
  };

  const onConfirmDelete = () => {
    setIsSubmitting(true);
    if (!deleteItem.current?.id) return;
    PagesSettingService.deleteAll({ ids: [deleteItem.current?.id] })
      .then((res) => {
        ToastService.success(res.message);
        getPageList();
        onCloseConfirm();
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
		<WxMainFull>
			<WxFormHeader
				title="Pages"
				rightContent={
					<WxButton variant="fill" onClick={() => navigate(PAGES_CREATE)}>
						Add Page
					</WxButton>
				}
			/>
			{isLoading ? <Preloader absolutePosition /> : null}
			<div className="card">
				{!isLoading && pages.length === 0 ? (
					<WxNotFound
						title="No pages found!"
						btn_link={PAGES_CREATE}
						btn_text="Add Page"
					/>
				) : null}

				{pages.length ? (
					<>
						<PageTable pages={pages} onDelete={onDelete} />
						<div className="p-4">
							<WxPagination
								meta={pageMeta}
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								paginationLimit={paginationLimit}
								setPaginationLimit={setPaginationLimit}
							/>
						</div>
					</>
				) : null}
			</div>
			<ConfirmationModal
				isOpen={confirmationModal}
				onClose={onCloseConfirm}
				onConfirm={onConfirmDelete}
				isSubmitting={isSubmitting}
				title="Page Delete Confirmation!"
				body={
					<p>
						Do you want to delete this page <b>{deleteItem.current?.title}</b>?
						This action will delete permanently.
					</p>
				}
			/>
		</WxMainFull>
	);
};
export default Pages;
