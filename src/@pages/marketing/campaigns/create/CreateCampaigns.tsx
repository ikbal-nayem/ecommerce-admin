import MainLg from "@components/MainContentLayout/MainLg";
import { FormHeader } from "@components/FormLayout";
import { MASTER_META_KEY } from "config/constants";
import { CAMPAIGNS } from "routes/path-name.route";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FacebookCampaignForm from "../components/FacebookCampaignForm";
import SMSCampaignForm from "../components/SMSCampaignForm";

const { MARKETING_CAMPAIGNS_SMS, MARKETING_CAMPAIGNS_FB } = MASTER_META_KEY;

const RenderComponent = {
  MARKETING_CAMPAIGNS_SMS: SMSCampaignForm,
  MARKETING_CAMPAIGNS_FB: FacebookCampaignForm,
};

const CreateCampaigns = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [campaign] = useState<string>(searchParams.get("campaign") || "");
  const [formTitle, setFormTitle] = useState<string>("");

  useEffect(() => {
    if (campaign === MARKETING_CAMPAIGNS_FB) {
      setFormTitle("Create Facebook Campaign");
    } else if (campaign === MARKETING_CAMPAIGNS_SMS) {
      setFormTitle("Create SMS Campaign");
    }
  }, [campaign]);

  return (
    <MainLg>
      <FormHeader
        noMargin
        title={formTitle}
        backNavigationLink={CAMPAIGNS + "?type=" + searchParams.get("campaign")}
      />
      {RenderComponent[campaign]({ isSaving, setIsSaving })}
    </MainLg>
  );
};

export default CreateCampaigns;
