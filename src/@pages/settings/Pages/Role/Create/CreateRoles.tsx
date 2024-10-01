import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxInput from "@components/WxInput";
import WxTextarea from "@components/WxTextarea";
import { SETTINGS_ROLES } from "routes/path-name.route";
import { AdminService } from "services/api/admin/Admin.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import WxMainLg from "@components/MainContentLayout/WxMainLg";

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
    <WxMainLg className="create_roles_sec">
      <WxFormHeader
        title={`${id ? "Update" : "Create"} Role`}
        backNavigationLink={SETTINGS_ROLES}
      />
      <form onSubmit={handleSubmit(onSubmitting)} noValidate>
        <div className="row w-100">
          <div className="col-lg-8 col-md-12 col-sm-12 wx__mt-3">
            <div className="card wx__p-4">
              <WxInput
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
          <div className="col-lg-4 col-md-12 col-sm-12 wx__mt-3">
            <div className="card wx__p-3">
              <WxButton type="submit" variant="fill" disabled={saving}>
                {id ? "Save" : "Create Role"} {saving ? <Preloader /> : null}
              </WxButton>
            </div>
          </div>
        </div>
      </form>
    </WxMainLg>
  );
};

export default CreateUserRoles;
