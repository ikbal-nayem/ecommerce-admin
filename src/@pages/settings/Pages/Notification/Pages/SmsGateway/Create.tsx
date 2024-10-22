import MainLg from "@components/MainContentLayout/MainLg";
import Select from "@components/Select/Select";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import TextInput from "@components/TextInput";
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
    <MainLg className="sms_gateway_sec">
      <FormHeader
        title="Order placement confirmation"
        backNavigationLink={SETTINGS_NOTIFICATION}
      />
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="row w-100">
          <div className="sms_gateway_left col-lg-8 col-md-12 col-sm-12 mt-3">
            <div className="card p-4">
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <Select
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
            <div className="card p-4 mt-4">
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <TextInput
                    label="Mask name"
                    isRequired
                    type="text"
                    registerProperty={{
                      ...register("maskName"),
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <TextInput
                    label="Non-mask name"
                    isRequired
                    type="text"
                    registerProperty={{
                      ...register("nonMaskName"),
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <TextInput
                    label="Username"
                    isRequired
                    type="text"
                    registerProperty={{
                      ...register("username"),
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <TextInput
                    label="Password"
                    isRequired
                    type="password"
                    registerProperty={{
                      ...register("password"),
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <TextInput
                    label="API Username"
                    isRequired
                    type="text"
                    registerProperty={{
                      ...register("apiUsername"),
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <TextInput
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
          <div className="sms_gateway_right col-lg-4 col-md-12 col-sm-12 mt-3">
            <div className="card p-4">
              <Button variant="fill" type="submit">
                Add
              </Button>
            </div>
          </div>
        </div>
      </form>
    </MainLg>
  );
};

export default OrderConfirmation;
