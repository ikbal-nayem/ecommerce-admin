import MainLg from "@components/MainContentLayout/MainLg";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import TextInput from "@components/TextInput";
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
    <MainLg>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormHeader
          title={`${section?.label} section`}
          rightContent={
            <Button variant="fill" type="submit">
              Save
            </Button>
          }
        />
        <div className="card p-4">
          {[...Array(section?.numberOfInputs || 0).fill(0)]?.map((_, i) => (
            <div
              className="border rounded px-4 py-2 my-2"
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
                      <TextInput
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
    </MainLg>
  );
};

export default SectionCustomize;
