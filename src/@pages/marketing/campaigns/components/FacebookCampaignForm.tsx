import DateInput from "@components/DatePicker/DateInput";
import Select from "@components/Select/Select";
import {Button} from "@components/Button";
import { FormFooter } from "@components/FormLayout";
import WxHr from "@components/WxHr";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import Label from "@components/Label";
import { MediaInput } from "@components/MediaInput";
import WxRadio from "@components/WxRadio/WxRadio";
import WxTextarea from "@components/WxTextarea";
import { IFilePayload } from "@interfaces/common.interface";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { dateFormate } from "utils/splitDate";

interface IFBCampaignFrom {
  campaign_name: string;
  campaignObjective: string;
  budget: string;
  amount: string;
  startDate: any;
  startTime: Date;
  targetedAudience: string;
  gender: string;
  ageStartFrom: string;
  adsContentRadio: string;
  ageEndTo: string;
  postIdOrLink: string;
  headline: string;
  website: string;
}

const campaignObjectRadio = [
  {
    id: 1,
    title: "Traffic",
  },
  {
    id: 2,
    title: "Send Message",
  },
  {
    id: 3,
    title: "Sales",
  },
];

const genderOpt = [
  { id: 1, title: "Male" },
  { id: 2, title: "FeMale" },
];

const FacebookCampaignForm = ({ isSaving }) => {
  const [imageList, setImageList] = useState<(IFilePayload | File)[]>([]);
  const [videoFile, setVideoFile] = useState([]);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFBCampaignFrom>({
    defaultValues: {
      adsContentRadio: "1",
      startDate: new Date(),
      startTime: new Date(),
    },
  });

  const onSubmitting = (data) => {
    console.log(data);
  };

  const handleImageOrderChange = useCallback((imgList: IFilePayload[]) => {
    setImageList([...imgList]);
  }, []);

  const handleRemove = useCallback(
    (imageData: IFilePayload, index: number) => {
      const imgList = [...imageList];
      imgList.splice(index, 1);
      setImageList(imgList);
      return;
    },
    [imageList]
  );

  return (
    <form className="mt-3" onSubmit={handleSubmit(onSubmitting)}>
      <div className="row ">
        <div className="col-md-12 col-lg-8 col-sm-12">
          <div className="card p-4 mb-3">
            <div className="row">
              <div className="col-md-12 col-lg-12">
                <h6>Campaign Info</h6>
                <TextInput
                  label="Campaign Name"
                  registerProperty={{
                    ...register("campaign_name"),
                  }}
                  placeholder="Enter campaign name here"
                  isRequired
                  color={errors?.campaign_name ? "danger" : "secondary"}
                  errorMessage={errors?.campaign_name?.message}
                />
              </div>
              <div className="col-md-12 col-lg-12">
                <WxRadio
                  options={campaignObjectRadio}
                  singleUse={false}
                  textKey="title"
                  id="campaignObjectRadio"
                  radioStyle="row"
                  returnValue="title"
                  name="campaignRadio"
                  //   checked={5}
                  registerProperty={{
                    ...register("campaignObjective"),
                  }}
                  isRequired
                  label="Campaigns Objectives"
                />
              </div>
            </div>
          </div>
          <div className="card p-4 mb-3">
            <div className="row">
              <h6 className="text_h6 text_semibold">
                Budget & Schedule
              </h6>
              <div className="col-md-6 col-lg-6 col-sm-12">
                <Select
                  label="Budget"
                  isRequired
                  options={genderOpt}
                  valuesKey="title"
                  textKey="title"
                  placeholder="Daily Budget"
                  registerProperty={{
                    ...register("budget"),
                  }}
                />
              </div>
              <div className="col-md-6 col-lg-6 col-sm-12">
                <TextInput
                  label="Amount"
                  startIcon={<Icon icon="attach_money" />}
                  registerProperty={{
                    ...register("amount"),
                  }}
                  placeholder="Type Amount"
                />
              </div>
              <div className="col-md-6 col-lg-6 col-sm-12">
                <DateInput
                  date={watch("startDate")}
                  setDate={(val: any) => {
                    const date = new Date(
                      dateFormate(val, "iso") +
                        "T" +
                        dateFormate(watch("startDate"), "time")
                    );
                    setValue("startDate", date);
                  }}
                  label="Start Date"
                  registerProperty={{
                    ...register("startDate"),
                  }}
                  endIcon={<Icon variants="round" icon="calendartoday" />}
                  errorMessage={errors.startDate?.message as string}
                  color={errors.startDate ? "danger" : "secondary"}
                />
              </div>
              <div className="col-md-6 col-lg-6 col-sm-12">
                <DateInput
                  label="Start Time (+06)"
                  type="time"
                  time={watch("startTime")}
                  setTime={(val: any) => {
                    const time = new Date(
                      dateFormate(watch("startTime"), "iso") +
                        "T" +
                        dateFormate(val, "time")
                    );
                    setValue("startTime", time);
                  }}
                  timeCaption="Time"
                  timeFormate="h:mm aa"
                  timeIntervals={15}
                  startIcon={<Icon variants="round" icon="schedule" />}
                  registerProperty={{
                    ...register("startTime"),
                  }}
                  errorMessage={errors.startTime?.message}
                  color={errors.startTime ? "danger" : "secondary"}
                />
              </div>
            </div>
          </div>
          <div className="card p-4 mb-3">
            <div className="row">
              <h6 className="text_h6 text_semibold">Audience Group</h6>
              <div className="col-md-12 col-lg-12 col-sm-12">
                <Label isRequired>Targeted Audience</Label>
                <WxTextarea
                  placeholder="Type your audience here"
                  helpText="An activation mail will be sent"
                  registerProperty={{
                    ...register("targetedAudience"),
                  }}
                />
              </div>
              <div className="col-md-6 col-lg-6 col-sm-12">
                <Select
                  registerProperty={{
                    ...register("gender"),
                  }}
                  label="Gender"
                  options={genderOpt}
                  valuesKey="title"
                  textKey="title"
                  placeholder="Select Gender"
                />
              </div>
              <div className="col-md-3 col-lg-3 col-sm-12">
                <Select
                  label="Age Range"
                  isRequired
                  options={ageOption}
                  textKey="title"
                  placeholder="Start from"
                  registerProperty={{ ...register("ageStartFrom") }}
                />
              </div>
              <div className="col-md-3 col-lg-3 col-sm-12 mt-4">
                <Select
                  options={ageOption}
                  textKey="title"
                  placeholder="End to"
                  registerProperty={{ ...register("ageEndTo") }}
                />
              </div>
            </div>
          </div>
          <div className="card p-4 mb-3">
            <div className="row">
              <h6 className="text_h6 text_semibold">Ads Content</h6>
              <div className="col-md-12 col-lg-12 col-sm-12">
                <WxRadio
                  label="Image"
                  id="newPostRadio1"
                  name="newPost"
                  noMargin
                  value={1}
                  singleUse={true}
                  registerProperty={{ ...register("adsContentRadio") }}
                >
                  {watch("adsContentRadio") === "1" && (
                    <div className="mt-2">
                      <MediaInput
                        multiple
                        fileList={imageList}
                      />
                    </div>
                  )}
                </WxRadio>
                <WxRadio
                  label="Video"
                  textKey="title"
                  id="newPostRadio2"
                  name="newPost"
                  value={2}
                  singleUse={true}
                  registerProperty={{ ...register("adsContentRadio") }}
                >
                  {watch("adsContentRadio") === "2" && (
                    <div className="mt-2">
                      <MediaInput
                        dragNDropFor="video"
                        dragNDropText="Video"
                        accept="video/mp4,video/x-m4v,video/*"
                        fileList={videoFile}
                      />
                    </div>
                  )}
                </WxRadio>
                <div>
                  <WxRadio
                    label="Existing Post"
                    textKey="title"
                    id="newPostRadio3"
                    name="newPost"
                    value={3}
                    singleUse={true}
                    registerProperty={{ ...register("adsContentRadio") }}
                  >
                    {watch("adsContentRadio") === "3" && (
                      <TextInput
                        className="mt-2"
                        placeholder="Enter Post ID or link"
                        registerProperty={{ ...register("postIdOrLink") }}
                      />
                    )}
                  </WxRadio>
                </div>
              </div>
              <div className="col-md-12 col-lg-12 col-sm-12">
                <TextInput
                  label="Headline"
                  placeholder="Type here Headline here"
                  isRequired
                  registerProperty={{ ...register("headline") }}
                />
              </div>
              <div className="col-md-12 col-lg-12 col-sm-12">
                <TextInput
                  label="Website"
                  placeholder="Type website link"
                  registerProperty={{ ...register("website") }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 col-sm-12">
          <div className="card p-4 mb-3">
            <Button disabled={isSaving} type="submit" variant="fill">
              Launch Campaign
            </Button>
            <WxHr />
            <WxHr />
            <div>
              <h6 className=" mb-0 text_strong">250</h6>
              <span className="text_small ">Total Audience Size</span>
            </div>
          </div>
        </div>
      </div>
      <WxHr />
      <FormFooter
        saveButtonText="Launch Campaign"
        title="unsaved changes"
        formName="smsCampaignForm"
      />
    </form>
  );
};

export default FacebookCampaignForm;

const ageOption = [
  {
    title: 1,
  },
  {
    title: 2,
  },
  {
    title: 3,
  },
  {
    title: 4,
  },
  {
    title: 5,
  },
  {
    title: 6,
  },
  {
    title: 7,
  },
  {
    title: 8,
  },
  {
    title: 9,
  },
  {
    title: 10,
  },
  {
    title: 11,
  },
  {
    title: 12,
  },
  {
    title: 13,
  },
  {
    title: 14,
  },
  {
    title: 15,
  },
  {
    title: 16,
  },
  {
    title: 17,
  },
  {
    title: 18,
  },
  {
    title: 19,
  },
  {
    title: 20,
  },
  {
    title: 21,
  },
  {
    title: 22,
  },
  {
    title: 23,
  },
  {
    title: 24,
  },
  {
    title: 25,
  },
  {
    title: 26,
  },
  {
    title: 27,
  },
  {
    title: 28,
  },
  {
    title: 29,
  },
  {
    title: 30,
  },
  {
    title: 31,
  },
  {
    title: 32,
  },
  {
    title: 33,
  },
  {
    title: 34,
  },
  {
    title: 35,
  },
  {
    title: 36,
  },
  {
    title: 37,
  },
  {
    title: 38,
  },
  {
    title: 39,
  },
  {
    title: 40,
  },
  {
    title: 41,
  },
  {
    title: 42,
  },
  {
    title: 43,
  },
  {
    title: 44,
  },
  {
    title: 45,
  },
  {
    title: 46,
  },
  {
    title: 47,
  },
  {
    title: 48,
  },
  {
    title: 49,
  },
  {
    title: 50,
  },
  {
    title: 51,
  },
  {
    title: 52,
  },
  {
    title: 53,
  },
  {
    title: 54,
  },
  {
    title: 55,
  },
  {
    title: 56,
  },
  {
    title: 57,
  },
  {
    title: 58,
  },
  {
    title: 59,
  },
  {
    title: 60,
  },
  {
    title: 61,
  },
  {
    title: 62,
  },
  {
    title: 63,
  },
  {
    title: 64,
  },
  {
    title: 65,
  },
  {
    title: 66,
  },
  {
    title: 67,
  },
  {
    title: 68,
  },
  {
    title: 69,
  },
  {
    title: 70,
  },
  {
    title: 71,
  },
  {
    title: 72,
  },
  {
    title: 73,
  },
  {
    title: 74,
  },
  {
    title: 75,
  },
  {
    title: 76,
  },
  {
    title: 77,
  },
  {
    title: 78,
  },
  {
    title: 79,
  },
  {
    title: 80,
  },
  {
    title: 81,
  },
  {
    title: 82,
  },
  {
    title: 83,
  },
  {
    title: 84,
  },
  {
    title: 85,
  },
  {
    title: 86,
  },
  {
    title: 87,
  },
  {
    title: 88,
  },
  {
    title: 89,
  },
  {
    title: 90,
  },
  {
    title: 91,
  },
  {
    title: 92,
  },
  {
    title: 93,
  },
  {
    title: 94,
  },
  {
    title: 95,
  },
  {
    title: 96,
  },
  {
    title: 97,
  },
  {
    title: 98,
  },
  {
    title: 99,
  },
  {
    title: 100,
  },
];
