import MainLg from "@components/MainContentLayout/MainLg";
import { FormFooter, FormHeader } from "@components/FormLayout";
import WxHr from "@components/WxHr";
import { AUDIENCES } from "routes/path-name.route";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SMSAudienceForm from "../components/SMSAudienceForm";

const RenderComponent = {
  MARKETING_AUDIENCE_SMS: SMSAudienceForm,
  MARKETING_AUDIENCE_EMAIL: SMSAudienceForm,
};

const FromName = {
  MARKETING_AUDIENCE_SMS: "smsAudienceForm",
  MARKETING_AUDIENCE_EMAIL: "smsAudienceForm",
};

const CreateAudience = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [audience] = useState<string>(searchParams.get("audience") || "");
  const [formTitle, setFormTitle] = useState<string>("");

  useEffect(() => {
    if (audience === "MARKETING_AUDIENCE_EMAIL") {
      setFormTitle("Create Facebook audience");
    } else if (audience === "MARKETING_AUDIENCE_SMS") {
      setFormTitle("Create SMS audience");
    }
  }, [audience]);

  return (
    <MainLg>
      <FormHeader
        noMargin
        title={formTitle}
        backNavigationLink={AUDIENCES + "?type=" + searchParams.get("audience")}
      />
      {/* <SMSAudienceForm /> */}

      {RenderComponent[audience]({ isSaving, setIsSaving })}

      <WxHr />
      <FormFooter
        saveButtonText="Create Audience"
        title="unsaved changes"
        formName={FromName[audience]}
        isSaving={isSaving}
      />
    </MainLg>
  );
};

export default CreateAudience;
