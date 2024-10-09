import {Button} from "@components/Button";
import WxCheckbox from "@components/WxCheckbox";
import WxDrawer from "@components/Drawer";
import WxDrawerBody from "@components/Drawer/DrawerBody";
import WxDrawerFooter from "@components/Drawer/DrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import TextInput from "@components/TextInput";
import {
  CollectionService,
  ICollectionPayload,
} from "services/api/products/Collection.services";
import Preloader from "services/utils/preloader.service";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDebounce from "utils/debouncer";

import WxIcon from "@components/Icon";
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
			<Button
				variant="outline"
				onClick={() => setDrawerOpen(true)}
				className="mb-3"
			>
				Select Collections
			</Button>
			<WxDrawer show={drawer_open} handleClose={handleClose}>
				<div className="collection_select">
					<WxDrawerHeader
						title="Select Collections"
						onClickClose={handleClose}
					/>

					<WxDrawerBody>
						<TextInput
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
							<Button
								className="me-3"
								variant="outline"
								color="secondary"
								onClick={handleClose}
							>
								Cancel
							</Button>
							<Button variant="fill" onClick={handleClose}>
								Select Category
							</Button>
						</div>
					</WxDrawerFooter>
				</div>
			</WxDrawer>
		</>
	);
};

export default SelectCollection;
