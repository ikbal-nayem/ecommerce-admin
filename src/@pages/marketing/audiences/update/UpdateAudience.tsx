import WxMainLg from "@components/MainContentLayout/WxMainLg";
import { WxFormFooter, WxFormHeader } from "@components/WxFormLayout";
import WxHr from "@components/WxHr";
import { MASTER_META_KEY } from "config/constants";
import { AUDIENCES } from "routes/path-name.route";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SMSAudienceForm from "../components/SMSAudienceForm";

const { MARKETING_AUDIENCE_SMS, MARKETING_AUDIENCE_EMAIL } = MASTER_META_KEY;

const RenderComponent = {
  MARKETING_AUDIENCE_SMS: SMSAudienceForm,
  MARKETING_AUDIENCE_EMAIL: SMSAudienceForm,
};

const FormName = {
  MARKETING_AUDIENCE_SMS: "smsAudienceForm",
  MARKETING_AUDIENCE_EMAIL: "smsAudienceForm",
};

const UpdateAudience = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [formTitle, setFormTitle] = useState<string>("");

  const [audience] = useState<string>(searchParams.get("audience") || "");

  useEffect(() => {
    if (audience === MARKETING_AUDIENCE_EMAIL) {
      setFormTitle("Update Email audience");
    } else if (audience === MARKETING_AUDIENCE_SMS) {
      setFormTitle("Update SMS audience");
    }
  }, [audience]);

  return (
    <WxMainLg>
      <WxFormHeader
        noMargin
        title={formTitle}
        backNavigationLink={AUDIENCES + "?type=" + searchParams.get("audience")}
      />
      {RenderComponent[audience]({ isSaving, setIsSaving })}
      <WxHr />
      <WxFormFooter
        saveButtonText="Update Audience"
        title="unsaved changes"
        formName={FormName[audience]}
        isSaving={isSaving}
      />
    </WxMainLg>
  );
};

export default UpdateAudience;
