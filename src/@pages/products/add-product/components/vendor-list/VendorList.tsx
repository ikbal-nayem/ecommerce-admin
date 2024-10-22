import WxDrawerBody from "@components/Drawer/DrawerBody";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import WxList from "@components/WxList";
import WxListItem from "@components/WxList/WxListItem";
import { IVendorPayload } from "services/api/products/Vendor.services";
import Preloader from "services/utils/preloader.service";
import React from "react";

type VendorListProps = {
  handleEdit?: Function;
  vendorList: IVendorPayload[];
  handleDelete?: (itemObject: IVendorPayload) => void;
  setSearchQuery?: (event: string) => void;
  isLoading?: boolean;
};

function VendorList({
  handleEdit,
  vendorList = [],
  handleDelete,
  setSearchQuery,
  isLoading,
}: VendorListProps) {
  return (
    <WxDrawerBody>
      <TextInput
        type="search"
        startIcon={<Icon icon="search" />}
        placeholder="Search vendors"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(e.target.value)
        }
      />
      {isLoading ? <Preloader /> : null}
      <WxList>
        {vendorList.map((item) => (
          <WxListItem
            key={item.id}
            btn
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
          >
            {item.name}
          </WxListItem>
        ))}
      </WxList>
    </WxDrawerBody>
  );
}

export default VendorList;
