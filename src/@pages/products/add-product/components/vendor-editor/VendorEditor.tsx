import { useEffect } from "react";
import DrawerBody from "@components/Drawer/DrawerBody";
import TextInput from "@components/TextInput";
import "./VendorEditor.scss";

type VendorEditorProps = {
  registerProps?: any;
};

const VendorEditor = ({ registerProps }: VendorEditorProps) => {
  return (
    <DrawerBody>
      <TextInput
        type="text"
        label="Vendor Name"
        placeholder="Name"
        isRequired
        registerProperty={{...registerProps('name', {required: true})}}
      />
    </DrawerBody>
  );
};

export default VendorEditor;
