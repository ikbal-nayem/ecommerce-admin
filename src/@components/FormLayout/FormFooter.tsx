import {Button} from "@components/Button";
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

const FormFooter = ({
  children,
  title,
  onCancel,
  saveButtonText,
  isSaving,
  onClickSave,
  formName,
}: IFormFooterProps) => {
  return (
    <div className="wx__form_footer d-flex justify-content-between">
      {children ? (
        children
      ) : (
        <>
          <span>{title}</span>
          <div className="d-flex">
            {onCancel ? (
              <div className="me-3">
                <Button
                  variant="outline"
                  color="secondary"
                  onClick={onCancel}
                  type="button"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            ) : null}
            <Button
              variant="fill"
              color="primary"
              type="submit"
              form={formName}
              disabled={isSaving}
              onClick={() => (onClickSave ? onClickSave() : null)}
            >
              {isSaving ? <ButtonLoader /> : saveButtonText || "Save"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FormFooter;
