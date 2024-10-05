import {Button} from "@components/Button";
import WxCheckbox from "@components/WxCheckbox";
import WxDrawer from "@components/WxDrawer";
import WxDrawerFooter from "@components/WxDrawer/WxDrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import WxIcon from "@components/Icon";
import TextInput from "@components/TextInput";
import WxThumbnail from "@components/Thumbnail";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useDebounce from "utils/debouncer";
import "./BrowseProduct.scss";

interface IBrowseProduct {
  drawerOpen: boolean;
  handleClose: Function;
}

const defaultChildCheckbox = [
  {
    id: "01",
    name: "S",
  },
  {
    id: "02",
    name: "M",
  },
  {
    id: "03",
    name: "L",
  },
];

const BrowseProduct = ({ drawerOpen, handleClose }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [checkList] = useState<any[]>(defaultChildCheckbox);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<any[]>([false]);

  interface ProductJSX {
    name?: string;
    src?: string;
  }

  const productJSX = ({ name, src }: ProductJSX) => {
    if (!name && !src) name = "N A";
    return (
      <div className="d-flex align-items-center">
        <div className="me-2">
          <WxThumbnail name={name} src={src} />
        </div>
        <span>Casual Shirt</span>
      </div>
    );
  };

  const handleSelectAll = () => {
    setCheckAll(!checkAll);
    setIsChecked(checkList.map((li) => li.id));
    if (checkAll) setIsChecked([]);
  };

  const handleClick = (e: any) => {
    const { id, checked } = e.target;
    console.log(id, checked);
    setIsChecked([...isChecked, id]);
    // checked?
    if (!checked) setIsChecked(isChecked.filter((item) => item !== id));
  };

  return (
    <WxDrawer show={drawerOpen}>
      <div className="wx__browse_product">
        <WxDrawerHeader title="Add Product" closeIconAction={handleClose} />
        <div className="wx__drawer_body">
          <div className="input_div">
            <TextInput
              className="mb-0"
              type="search"
              placeholder="Search products"
              startIcon={<WxIcon icon="search" />}
              onChange={(e: any) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="checkbox">
            <div>
              <WxCheckbox
                onChange={handleSelectAll}
                id="xxx"
                label={productJSX({ name: "N A}" })}
              />
              <div className="children ms-4">
                {checkList.map(({ id, name }, i) => (
                  <WxCheckbox
                    onChange={(e: any) => handleClick(e)}
                    checked={isChecked.includes(id)}
                    key={id}
                    id={id}
                    label={name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <WxDrawerFooter>
          <div className="d-flex">
            <Button className="me-3" variant="outline" color="secondary">
              Cancel
            </Button>
            <Button
              type={isEditorOpen ? "submit" : "button"}
              variant="fill"
              onClick={() => (!isEditorOpen ? setIsEditorOpen(true) : null)}
            >
              {isEditorOpen ? "Save" : "Add Vendor"}
            </Button>
          </div>
        </WxDrawerFooter>
      </div>
    </WxDrawer>
  );
};

export default BrowseProduct;
