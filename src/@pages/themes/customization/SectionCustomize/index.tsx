import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxInput from "@components/WxInput";
import WxTextarea from "@components/WxTextarea";
import { themeConfig$ } from "@rxjs/theme-config.rx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const SectionCustomize = () => {
  const [themeConfiguration, setThemeConfiguration] = useState(
    themeConfig$.initState
  );
  const { register, handleSubmit } = useForm();
  const { section_key } = useParams();

  useEffect(() => {
    const tc = themeConfig$.subscribe(setThemeConfiguration);
    themeConfig$.init();
    return () => tc.unsubscribe();
  }, []);

  const onSubmit = (data) => {
    console.log(data);
  };

  const section: any = themeConfiguration?.sections?.find(
    (sec: any) => sec?.key === section_key
  );

  return (
    <WxMainLg>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <WxFormHeader
          title={`${section?.label} section`}
          rightContent={
            <WxButton variant="fill" type="submit">
              Save
            </WxButton>
          }
        />
        <div className="card p-4">
          {[...Array(section?.numberOfInputs || 0).fill(0)]?.map((_, i) => (
            <div
              className="border rounded wx__px-4 wx__py-2 wx__my-2"
              key={`sec-${i}`}
            >
              <h5>
                {section?.label} {i + 1}
              </h5>
              <div className="row">
                {Object.keys(section?.template || {})?.map((sec) => (
                  <div className="col-md-6 col-12" key={"sub" + sec}>
                    {section?.template?.[sec]?.inputType === "textarea" ? (
                      <WxTextarea label={section?.template?.[sec]?.label} />
                    ) : (
                      <WxInput
                        label={section?.template?.[sec]?.label}
                        type={section?.template?.[sec]?.inputType}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </form>
    </WxMainLg>
  );
};

export default SectionCustomize;
