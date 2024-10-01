import WxButton from "@components/WxButton";
import { ButtonLoader } from "services/utils/preloader.service";

type IFormFooterProps = {
  children?: JSX.Element | JSX.Element[];
  title?: string;
  onCancel?: () => void;
  saveButtonText?: string;
  isSaving?: boolean;
  onClickSave?: () => void;
  formName?: string;
};

const WxFormFooter = ({
  children,
  title,
  onCancel,
  saveButtonText,
  isSaving,
  onClickSave,
  formName,
}: IFormFooterProps) => {
  return (
    <div className="wx__form_footer d-flex wx__justify-content-between">
      {children ? (
        children
      ) : (
        <>
          <span>{title}</span>
          <div className="d-flex">
            {onCancel ? (
              <div className="wx__me-3">
                <WxButton
                  variant="outline"
                  color="secondary"
                  onClick={onCancel}
                  type="button"
                  disabled={isSaving}
                >
                  Cancel
                </WxButton>
              </div>
            ) : null}
            <WxButton
              variant="fill"
              color="primary"
              type="submit"
              form={formName}
              disabled={isSaving}
              onClick={() => (onClickSave ? onClickSave() : null)}
            >
              {isSaving ? <ButtonLoader /> : saveButtonText || "Save"}
            </WxButton>
          </div>
        </>
      )}
    </div>
  );
};

export default WxFormFooter;
