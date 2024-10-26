import MainLg from "@components/MainContentLayout/MainLg";
import {Button} from "@components/Button";
import { FormFooter } from "@components/FormLayout";
import FormContainer from "@components/FormLayout/FormContainer";
import FormHeader from "@components/FormLayout/FormHeader";
import TextInput from "@components/TextInput";
import Label from "@components/Label";
import MediaInput from "@components/MediaInput/MediaInput";
import WxTextarea from "@components/WxTextarea";
import { IFilePayload } from "@interfaces/common.interface";
import { IPreferencesSettings } from "@interfaces/Settings.interface";
import { StoreConfigService } from "services/api/settings/StoreConfig.service";
import Preloader, { ButtonLoader } from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { compressImage } from "utils/utils";

const imageParams = ["siteLogo", "siteFavicon", "siteSocialImg"];
const imageUploadParams = ["siteLogo", "favIcon", "socialImage"];

const Preferences = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [siteLogo, setSiteLogo] = useState<IFilePayload[] | File[]>([]);
  const [favicon, setFavicon] = useState<IFilePayload[] | File[]>([]);
  const [socialMediaImage, setSocialMediaImage] = useState<
    IFilePayload[] | File[]
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<IPreferencesSettings>({ mode: "onChange" });

  useEffect(() => {
    StoreConfigService.getConfig()
      .then((resp) => {
        setSiteLogo(resp.body?.siteLogo ? [resp.body?.siteLogo] : []);
        setFavicon(resp.body?.siteFavicon ? [resp.body?.siteFavicon] : []);
        setSocialMediaImage(
          resp.body?.siteSocialImg ? [resp.body?.siteSocialImg] : []
        );
        reset({ ...resp.body });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleImageAdd = useCallback((images: File[], idx) => {
    const setImageState = [setSiteLogo, setFavicon, setSocialMediaImage];
    const imgParam: any = imageParams[idx];
    setValue(imgParam, null);
    setImageState[idx](images);
  }, []);

  const onImageRemove = (idx) => {
    const setImageState = [setSiteLogo, setFavicon, setSocialMediaImage];
    const imgParam: any = imageParams[idx];
    setValue(imgParam, null);
    setImageState[idx]([]);
  };

  const compressAllImage = () => {
    return Promise.all(
      [siteLogo, favicon, socialMediaImage].map((img) => {
        if (img?.[0] instanceof File) {
          return compressImage(img?.[0], 0.2);
        } else return null;
      })
    );
  };

  const onSubmitting = async (requestData) => {
    setIsSaving(true);
    const cImages = await compressAllImage();
    const formData = new FormData();
    formData.append("body", JSON.stringify(requestData));
    cImages.forEach((img, idx) => {
      formData.append(imageUploadParams[idx], img);
    });
    StoreConfigService.save(formData)
      .then((response) => ToastService.success(response.message))
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsSaving(false));
  };

  if (isLoading) return <Preloader absolutePosition size={50} />;

  return (
    <MainLg>
      <FormContainer>
        <FormHeader title="Preferences" />
        <form onSubmit={handleSubmit(onSubmitting)} noValidate>
          <div className="row">
            <div className="col-lg-9 col-md-8 col-sm-12">
              <div className="card p-3">
                <Label>Site logo Preview</Label>
                <MediaInput
                  // fileList={siteLogo}
                  // onChange={(image) => handleImageAdd(image, 0)}
                  // onRemove={() => onImageRemove(0)}
                  // multiple={false}
                />
              </div>
              <div className="card p-3">
                <Label>Site favicon Preview</Label>
                <MediaInput
                  // fileList={favicon}
                  // onChange={(image) => handleImageAdd(image, 1)}
                  // onRemove={() => onImageRemove(1)}
                  // multiple={false}
                />
              </div>
              <div className="card p-3">
                <Label>Social media Image Preview</Label>
                <MediaInput
                  // fileList={socialMediaImage}
                  // onChange={(image) => handleImageAdd(image, 2)}
                  // onRemove={() => onImageRemove(2)}
                  // multiple={false}
                />
              </div>
              <div className="card p-4">
                <h6 className="text_h6 text_semibold">
                  Page Meta for Basic SEO
                </h6>
                <p className="text_body text_regular text-muted">
                  The title and meta description help define how your store
                  shows up on search engines.
                </p>
                <TextInput
                  label="Site title"
                  registerProperty={{
                    ...register("siteTitle"),
                  }}
                />
                <TextInput
                  label="Site Author"
                  registerProperty={{
                    ...register("siteAuthor"),
                  }}
                  helpText="The name of the author of the site"
                />
                <WxTextarea
                  label="Description"
                  rows={6}
                  registerProperty={{
                    ...register("siteDesc", { maxLength: 255 }),
                  }}
                  helpText="Max lenght 255"
                  color={errors?.siteDesc ? "danger" : "secondary"}
                />
                <TextInput
                  label="Site Keywords"
                  registerProperty={{
                    ...register("siteKeywords"),
                  }}
                  helpText="Use comma(,) to seperate the tags (eg: keyword1, keyword2, keyword3)"
                />
                <TextInput
                  label="Cart Button Text"
                  noMargin
                  registerProperty={{
                    ...register("cartButtonText"),
                  }}
                  helpText="Ex: Add to cart, Add to bag"
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-12">
              <div className="card wx__form_right">
                <Button type="submit" variant="fill" disabled={isSaving}>
                  {isSaving ? <ButtonLoader /> : "Save"}
                </Button>
              </div>
            </div>
          </div>
          <FormFooter saveButtonText="Save" isSaving={isSaving} />
        </form>
      </FormContainer>
    </MainLg>
  );
};

export default Preferences;
