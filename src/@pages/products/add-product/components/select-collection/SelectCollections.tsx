import WxButton from "@components/WxButton";
import WxCheckbox from "@components/WxCheckbox";
import WxDrawer from "@components/WxDrawer";
import WxDrawerBody from "@components/WxDrawer/WxDrawerBody";
import WxDrawerFooter from "@components/WxDrawer/WxDrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import WxInput from "@components/WxInput";
import {
  CollectionService,
  ICollectionPayload,
} from "services/api/products/Collection.services";
import Preloader from "services/utils/preloader.service";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDebounce from "utils/debouncer";

import WxIcon from "@components/WxIcon/WxIcon";
import { ToastService } from "services/utils/toastr.service";
import "./SelectCollections.scss";

type SelectCollectionProps = {
  selectedCollections?: ICollectionPayload[];
  setCollections?: (category: ICollectionPayload) => void;
};

const SelectCollection = ({
  selectedCollections,
  setCollections,
}: SelectCollectionProps) => {
  const [drawer_open, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [collectionList, setCollectionList] = useState<ICollectionPayload[]>(
    []
  );
  let search = useDebounce(searchQuery, 500);

  const handleClose = () => setDrawerOpen(false);

  useEffect(() => {
    drawer_open && getCollectionList();
  }, [drawer_open]);

  useEffect(() => {
    search && getCollectionList(search);
  }, [search]);

  const getCollectionList = (searchString: string = null) => {
    setIsLoading(true);
    const payload = {
      body: { name: searchString },
      meta: { offset: 0, limit: 20 },
    };
    CollectionService.get(payload)
			.then((res) => {
				if (res.body.length) setCollectionList(res.body);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsLoading(false));
  };

  return (
		<>
			<WxButton
				variant="outline"
				onClick={() => setDrawerOpen(true)}
				className="mb-3"
			>
				Select Collections
			</WxButton>
			<WxDrawer show={drawer_open} handleClose={handleClose}>
				<div className="collection_select">
					<WxDrawerHeader
						title="Select Collections"
						closeIconAction={handleClose}
					/>

					<WxDrawerBody>
						<WxInput
							type="search"
							startIcon={<WxIcon icon="search" />}
							placeholder="Search categories"
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setSearchQuery(e.target.value)
							}
						/>
						{isLoading ? <Preloader absolutePosition /> : null}
						<div className="collections">
							{!collectionList?.length ? (
								<div className="text-center">No collections found!</div>
							) : null}
							<ul>
								{collectionList?.map((collection) => (
									<li key={collection.id}>
										<WxCheckbox
											id={collection.id}
											label={collection.name}
											onChange={() => setCollections(collection)}
											checked={selectedCollections.some(
												(val) => val.id === collection.id
											)}
										/>
									</li>
								))}
							</ul>
						</div>
					</WxDrawerBody>

					<WxDrawerFooter>
						<div className="wx__category_select__footer">
							<WxButton
								className="me-3"
								variant="outline"
								color="secondary"
								onClick={handleClose}
							>
								Cancel
							</WxButton>
							<WxButton variant="fill" onClick={handleClose}>
								Select Category
							</WxButton>
						</div>
					</WxDrawerFooter>
				</div>
			</WxDrawer>
		</>
	);
};

export default SelectCollection;
