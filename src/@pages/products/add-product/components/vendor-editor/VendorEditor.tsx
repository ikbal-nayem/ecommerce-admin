import { useEffect } from "react";
import WxDrawerBody from "@components/Drawer/DrawerBody";
import TextInput from "@components/TextInput";
import "./VendorEditor.scss";

type VendorEditorProps = {
  registerProps?: any;
};

const VendorEditor = ({ registerProps }: VendorEditorProps) => {
  return (
    <WxDrawerBody>
      <TextInput
        type="text"
        label="Vendor Name"
        placeholder="Name"
        isRequired
        registerProperty={{...registerProps('name', {required: true})}}
      />
    </WxDrawerBody>
  );
};

export default VendorEditor;
