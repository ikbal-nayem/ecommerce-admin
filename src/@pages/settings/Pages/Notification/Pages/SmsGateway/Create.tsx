import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxSelect from "@components/Select/WxSelect";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxInput from "@components/WxInput";
import { SETTINGS_NOTIFICATION } from "routes/path-name.route";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location: any = useLocation();

  const [activeTab, setActiveTab] = useState<number>(0);
  const { register, handleSubmit } = useForm();
  const [ssmGateway, setSmsGateway] = useState<number>(1);
  const [smsGatewayOption] = useState<any>([
    {
      id: 1,
      text: "Getway 1",
    },
    {
      id: 2,
      text: "Getway 2",
    },
    {
      id: 3,
      text: "Getway 3",
    },
    {
      id: 4,
      text: "Getway 4",
    },
  ]);
  useEffect(() => {
    if (location?.state) setActiveTab(parseInt(location.state) - 1);
  }, []);

  const onSubmitHandler = (requestData: any) => {
    requestData.smsGateway = ssmGateway;
    console.log(requestData);
  };

  const onChangeGateway = (value: any) => {
    console.log(value.target.value);
    setSmsGateway(value.target.value);
  };

  return (
    <WxMainLg className="sms_gateway_sec">
      <WxFormHeader
        title="Order placement confirmation"
        backNavigationLink={SETTINGS_NOTIFICATION}
      />
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="wx__row wx__w-100">
          <div className="sms_gateway_left wx__col-lg-8 wx__col-md-12 wx__col-sm-12 wx__mt-3">
            <div className="wx__card wx__p-4">
              <div className="wx__row">
                <div className="wx__col-md-12 wx__col-sm-12">
                  <WxSelect
                    isRequired
                    label="Select SMS Gateway"
                    valuesKey="id"
                    textKey="text"
                    options={smsGatewayOption}
                    onChange={onChangeGateway}
                  />
                </div>
              </div>
            </div>
            <div className="wx__card wx__p-4 wx__mt-4">
              <div className="wx__row">
                <div className="wx__col-md-6 wx__col-sm-12">
                  <WxInput
                    label="Mask name"
                    isRequired
                    type="text"
                    registerProperty={{
                      ...register("maskName"),
                    }}
                  />
                </div>
                <div className="wx__col-md-6 wx__col-sm-12">
                  <WxInput
                    label="Non-mask name"
                    isRequired
                    type="text"
                    registerProperty={{
                      ...register("nonMaskName"),
                    }}
                  />
                </div>
                <div className="wx__col-md-6 wx__col-sm-12">
                  <WxInput
                    label="Username"
                    isRequired
                    type="text"
                    registerProperty={{
                      ...register("username"),
                    }}
                  />
                </div>
                <div className="wx__col-md-6 wx__col-sm-12">
                  <WxInput
                    label="Password"
                    isRequired
                    type="password"
                    registerProperty={{
                      ...register("password"),
                    }}
                  />
                </div>
                <div className="wx__col-md-6 wx__col-sm-12">
                  <WxInput
                    label="API Username"
                    isRequired
                    type="text"
                    registerProperty={{
                      ...register("apiUsername"),
                    }}
                  />
                </div>
                <div className="wx__col-md-6 wx__col-sm-12">
                  <WxInput
                    label="API Token/Password"
                    isRequired
                    type="text"
                    registerProperty={{
                      ...register("apiToken"),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sms_gateway_right wx__col-lg-4 wx__col-md-12 wx__col-sm-12 wx__mt-3">
            <div className="wx__card wx__p-4">
              <WxButton variant="fill" type="submit">
                Add
              </WxButton>
            </div>
          </div>
        </div>
      </form>
    </WxMainLg>
  );
};

export default OrderConfirmation;
