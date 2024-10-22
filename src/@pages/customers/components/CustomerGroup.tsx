import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import {Button} from "@components/Button";
import WxDrawer from "@components/Drawer";
import WxDrawerBody from "@components/Drawer/DrawerBody";
import WxDrawerFooter from "@components/Drawer/DrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import WxList from "@components/WxList";
import WxListItem from "@components/WxList/WxListItem";
import { GroupService } from "services/api/Group.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import useDebounce from "utils/debouncer";
import "./CustomerGroup.scss";

type CustomerGroupProps = {
  drawerOpen?: boolean;
  handleClose?: Function;
};

const CustomerGroup = ({ drawerOpen, handleClose }: CustomerGroupProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfirmOpenModal, setIsConfirmOpenModal] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editData, setEditData] = useState<any>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deletedData, setDeletedData] = useState<any>(null);
  const [groupList, setGroupList] = useState<any[]>([]);
  let search = useDebounce(searchQuery, 500);
  const { register, handleSubmit, setValue, reset } = useForm();

  const { user_data } = useSelector((value: any) => value.user);

  useEffect(() => {
    if (!isConfirmOpenModal) setDeletedData("");
  }, [isConfirmOpenModal]);

  useEffect(() => {
    if (searchQuery || drawerOpen) getGroupList();
  }, [search || drawerOpen]);

  const handleEditorClose = () => {
    reset();
    setIsEditorOpen(false);
    setEditData({});
  };

  const handleEdit = (data: any) => {
    reset();
    setIsEditorOpen(true);
    setValue("name", data.title);
    setEditData(data);
  };

  const getGroupList = () => {
    setIsLoading(true);
    const payload = {
      body: { title: searchQuery },
      meta: { offset: 0, limit: 20 },
    };
    GroupService.get(payload)
      .then((response) => {
        setGroupList(response.body);
      })
      .then((err) => {})
      .finally(() => setIsLoading(false));
  };

  const handleDelete = (data: string) => {
    setIsConfirmOpenModal(true);
    setDeletedData(data);
  };

  const handleSave = (data: any) => {
    if (editData?.id) {
      GroupService.update({
        id: editData.id,
        title: data.name,
      })
        .then((res) => {
          ToastService.success("Group updated successfully");
          getGroupList();
          setIsEditorOpen(false);
          setEditData({});
        })
        .catch((err) => {
          ToastService.error(err.message);
        });
      return;
    }
    GroupService.create({
      title: data.name,
    })
      .then((res) => {
        ToastService.success("Group created successfully!");
        getGroupList();
        setIsEditorOpen(false);
      })
      .catch((err) => {
        ToastService.error(err.message);
      });
  };
  const onConfirmGroup = () => {
    if (!deletedData.id) ToastService.error("Something went wrong");
    GroupService.delete([deletedData.id])
      .then((res) => {
        setIsConfirmOpenModal(false);
        getGroupList();
        setIsEditorOpen(false);
        ToastService.success("Group deleted successfully");
      })
      .catch((err: any) => {
        ToastService.error(err?.message || "Something went wrong");
      });
  };

  return (
    <>
      <WxDrawer show={drawerOpen} handleClose={handleClose}>
        <div className="wx__manage_customer_group">
          <WxDrawerHeader
            title={
              isEditorOpen
                ? `${editData?.id ? "Edit" : "Add"} Group`
                : "Manage Group"
            }
            backIconAction={isEditorOpen ? handleEditorClose : null}
            onClickClose={handleClose}
          />
          <form noValidate onSubmit={handleSubmit(handleSave)}>
            <WxDrawerBody>
              {isEditorOpen ? (
                <TextInput
                  type="text"
                  label="Group Name"
                  placeholder="Name"
                  isRequired
                  registerProperty={{
                    ...register("name", { required: true }),
                  }}
                />
              ) : (
                <>
                  <TextInput
                    type="search"
                    startIcon={<Icon icon="search" />}
                    placeholder="Search Group"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value)
                    }
                  />
                  {isLoading ? <Preloader /> : null}
                  <WxList>
                    {groupList.length
                      ? groupList.map((item) => (
                          <WxListItem
                            key={item.id}
                            btn
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item)}
                          >
                            {item.title || ""}
                          </WxListItem>
                        ))
                      : null}
                  </WxList>
                </>
              )}
            </WxDrawerBody>
            <WxDrawerFooter>
              <div className="wx__manage_customer_group__footer">
                {editData?.id ? (
                  <div className="me-auto">
                    <Button
                      color="danger"
                      variant="fill"
                      onClick={() => handleDelete(editData)}
                    >
                      Delete
                    </Button>
                  </div>
                ) : null}
                <Button
                  className="me-3"
                  variant="outline"
                  color="secondary"
                  onClick={() =>
                    isEditorOpen ? handleEditorClose() : handleClose()
                  }
                >
                  Cancel
                </Button>
                <Button
                  type={isEditorOpen ? "submit" : "button"}
                  variant="fill"
                  onClick={() => (!isEditorOpen ? setIsEditorOpen(true) : null)}
                >
                  {isEditorOpen ? "Save" : "Add Group"}
                </Button>
                <ConfirmationModal
                  onConfirm={() => onConfirmGroup()}
                  isOpen={isConfirmOpenModal}
                  setIsOpen={setIsConfirmOpenModal}
                  title="Delete Group"
                  body={`Are you sure you want to delete ${deletedData?.title}?`}
                />
              </div>
            </WxDrawerFooter>
          </form>
        </div>
      </WxDrawer>
    </>
  );
};

export default CustomerGroup;
