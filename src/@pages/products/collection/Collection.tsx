import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxNotFound from "@components/NotFound/WxNotFound";
import WxButton from "@components/WxButton";
import WxPagination from "@components/WxPagination/WxPagination";
import CollectionTBSkelton from "@components/WxSkelton/CollectionTBSkelton";
import {
  CollectionService,
  ICollectionPayload,
} from "services/api/products/Collection.services";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import skeltonLoader from "utils/skeltonLoader";
import CollectionAdd from "./collection-add/CollectionAdd";
import CollectionTable from "./collection-table/CollectionTable";
import "./Collection.scss";

const Collection = () => {
  const [open, setOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editData, setEditData] = useState<ICollectionPayload>();
  const [collections, setCollections] = useState<ICollectionPayload[]>();
  const [collectionMeta, setCollectionMeta] = useState<any>();
  const deleteItem = useRef(null);
  // pagination states
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page"))
      ? Number(searchParams.get("page")) - 1
      : null || 0
  );
  const [paginationLimit, setPaginationLimit] = useState(10);

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setEditData(null);
    setIsConfirmOpen(false);
    deleteItem.current = null;
  };

  useEffect(() => {
    if (currentPage || paginationLimit) getCollection();
  }, [currentPage, paginationLimit]);

  const getCollection = () => {
    setIsLoading(true);
    CollectionService.get({
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
        if (res.body.length) setCollections(res.body);
        setCollectionMeta(res.meta || {});
      })
      .catch((err) => ToastService.error(err))
      .finally(() => {
        setIsLoading(false);
        skeltonLoader(setIsLoader);
      });
  };

  const getCollectionById = (id: string) => {
    CollectionService.collectionGetById(id)
      .then((res) => {
        setEditData(res.body);
      })
      .catch((err) => ToastService.error(err));
  };

  const handleEdit = (data: ICollectionPayload) => {
    getCollectionById(data.id);
    setIsEdit(true);
    setOpen(true);
  };

  // This function will be called when user click on comfirm delete button
  const onConfirmDelete = () => {
		const { id } = deleteItem.current;
		if (!id) {
			handleClose();
			return;
		}
		setIsSaving(true);
		CollectionService.delete({ id })
			.then((res) => {
				handleClose();
				getCollection();
				onConfirmClose();
				ToastService.success("Collection deleted successfully");
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSaving(false));
	};

	const handleDelete = (item: ICollectionPayload) => {
		deleteItem.current = item;
		setIsConfirmOpen(true);
	};

	const onConfirmClose = () => {
		deleteItem.current = null;
		setIsConfirmOpen(false);
	};

	const onSubmit = (data: ICollectionPayload) => {
		setIsSaving(true);
		if (isEdit) {
			CollectionService.update(data)
				.then((response) => {
					ToastService.success(response.message);
					handleClose();
					getCollection();
				})
				.catch((error) => ToastService.error(error.message))
				.finally(() => setIsSaving(false));
			return;
		}

		const img: any = data?.banner;
		delete data?.banner;
		const newData = new FormData();
		newData.append("body", JSON.stringify(data));
		newData.append("file", img);
		CollectionService.create(newData)
			.then((response) => {
				ToastService.success(response.message);
				handleClose();
				getCollection();
			})
			.catch((error) => ToastService.error(error.message))
			.finally(() => setIsSaving(false));
		return;
	};

	return (
		<WxMainLg className="collection_container">
			<div className="d-flex wx__justify-content-between wx__align-items-center">
				<h4 className="wx__text_h4 wx__text_semibold wx__mb-0">Collection</h4>
				<WxButton
					disabled={isLoader}
					variant="fill"
					onClick={() => setOpen(true)}
				>
					Add Collection
				</WxButton>
				<CollectionAdd
					isOpen={open}
					handleClose={handleClose}
					onSubmit={onSubmit}
					isEditForm={isEdit}
					editData={editData}
					isSaving={isSaving}
					handleDelete={handleDelete}
				/>
			</div>
			{!isLoader && !isLoading && !collections?.length ? (
				<div className="wx__mt-3">
					<WxNotFound title="No collection found!" />
				</div>
			) : null}
			{isLoader ? (
				<div className="wx__bg-white wx__mt-3 rounded">
					<CollectionTBSkelton viewBox="0 0 600 310" />
				</div>
			) : (
				<div className="collection_table_content">
					{collections?.length && (
						<>
							<CollectionTable
								data={collections}
								handleEdit={handleEdit}
								onDelete={handleDelete}
							/>
							<div className="wx__p-4">
								<WxPagination
									meta={collectionMeta}
									currentPage={currentPage}
									setCurrentPage={setCurrentPage}
									paginationLimit={paginationLimit}
									setPaginationLimit={setPaginationLimit}
								/>
							</div>
						</>
					)}
				</div>
			)}
			<ConfirmationModal
				isSubmitting={isSaving}
				isOpen={isConfirmOpen}
				onClose={onConfirmClose}
				onConfirm={onConfirmDelete}
				body={`Are your sure you want to delete '${deleteItem.current?.name}'? This action wont be reverseable!`}
			/>
		</WxMainLg>
	);
};

export default Collection;
