import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import TextInput from "@components/TextInput";
import WxTextarea from "@components/WxTextarea";
import { SETTINGS_ROLES } from "routes/path-name.route";
import { AdminService } from "services/api/admin/Admin.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import MainLg from "@components/MainContentLayout/MainLg";

const CreateUserRoles = () => {
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      AdminService.getRoleById({ id })
        .then((res) => {
          reset({ ...res.body });
        })
        .catch((err) => {
          ToastService.error(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const navigate = useNavigate();

  const onSubmitting = (requestData: any) => {
    setSaving(true);
    const requestAPI = id
      ? AdminService.updateRoleByMerchant
      : AdminService.createRoleByMerchant;
    requestAPI(requestData)
      .then((res) => {
        ToastService.success("Role created successfully");
        navigate(SETTINGS_ROLES);
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setSaving(false));
  };

  if (loading) return <Preloader />;

  return (
    <MainLg className="create_roles_sec">
      <FormHeader
        title={`${id ? "Update" : "Create"} Role`}
        backNavigationLink={SETTINGS_ROLES}
      />
      <form onSubmit={handleSubmit(onSubmitting)} noValidate>
        <div className="row w-100">
          <div className="col-lg-8 col-md-12 col-sm-12 mt-3">
            <div className="card p-4">
              <TextInput
                isRequired
                label="Role Name"
                isAutoFocus
                registerProperty={{
                  ...register("roleName", { required: true }),
                }}
                color={errors?.roleName ? "danger" : "secondary"}
                errorMessage={errors?.roleName ? "Role Name is required!" : ""}
              />
              <WxTextarea
                label="Role Note"
                noMargin
                rows={3}
                maxLength={255}
                registerProperty={{
                  ...register("note"),
                }}
                helpText="Maximum length 255 characters"
              />
            </div>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12 mt-3">
            <div className="card p-3">
              <Button type="submit" variant="fill" disabled={saving}>
                {id ? "Save" : "Create Role"} {saving ? <Preloader /> : null}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </MainLg>
  );
};

export default CreateUserRoles;
