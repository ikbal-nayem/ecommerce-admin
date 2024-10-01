import WxAlert from "@components/Alert/WxAlert";
import WxIcon from "@components/WxIcon/WxIcon";
import { IFilePayload } from "@interfaces/common.interface";
import { SETTINGS_PRICING_PLAN } from "routes/path-name.route";
import Preloader from "services/utils/preloader.service";
import { Fragment, memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { imageURLGenerate } from "utils/utils";
import { read, utils } from "xlsx";
import "./MediaInput.scss";

interface IMediaInputProps {
  fileList?: any[];
  imagesData?: any;
  setImagesData?: any;
  multiple?: boolean;
  isUploading?: boolean;
  maxSelect?: number;
  icon?: string;
  variants?: any;
  dragNDropFor?: string;
  dragNDropText?: string;
  recommendedText?: string;
  accept?: string;
  onChange?: (event: any) => void;
  onOrderChange?: (fileList: IFilePayload[] | File[]) => void;
  onRemove?: (fileObject?: IFilePayload | File, idx?: number) => void;
  onSelect?: (imgObj: IFilePayload | File, idx?: number) => void;
  selectedImages?: IFilePayload[] | File[];
}

const MediaInput = ({
  fileList = [],
  multiple,
  maxSelect,
  isUploading,
  dragNDropFor = "image",
  dragNDropText = "images",
  recommendedText = "1000px X 1000px",
  accept = "image/png, image/jpg, image/jpeg",
  icon = "image",
  variants = "outlined",
  onChange,
  onOrderChange,
  onRemove,
  onSelect,
  selectedImages,
}: IMediaInputProps) => {
  const [fileItems, setFileItems] = useState<any[]>(fileList);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [isLimitExceeded, setIsLimitExceeded] = useState<boolean>(false);
  const [fileDetails, setFileDetails] = useState<any>({});
  const shouldResetNext = useRef(true);

  // maximum image can select
  maxSelect = maxSelect === -1 ? 999 : maxSelect;

  useEffect(() => {
    if (fileList.length) {
      Object.keys(fileList).forEach((_, i) => {
        if (fileList[i] instanceof File && !fileList[i]?.previewUrl) {
          fileList[i].previewUrl = URL.createObjectURL(fileList[i]);
        }
      });
      setFileItems(fileList);
      shouldResetNext.current = true;
    } else if (shouldResetNext.current) {
      setFileItems([]);
      shouldResetNext.current = false;
    }
  }, [fileList]);

  const onDragStart = (e, index: number, id: any) => {
    const moveElement = document.getElementById(id);
    moveElement.classList.add("drag-element");
    setDraggedItem(fileItems[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", moveElement);
    e.dataTransfer.setDragImage(moveElement, 10, 10);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = fileItems[index];
    if (draggedItem === draggedOverItem) return;
    let reorderedItems = fileItems.filter((item) => item !== draggedItem);
    reorderedItems.splice(index, 0, draggedItem);
    setFileItems(reorderedItems);
  };

  const onDragEnd = (id: string) => {
    const moveElement = document.getElementById(id);
    moveElement.classList.remove("drag-element");
    setDraggedItem(null);
    onOrderChange(fileItems);
  };

  const onFileSelect = (file) => {
    if (dragNDropFor === "image") {
      if (maxSelect && file?.length + fileItems?.length > maxSelect) {
        setIsLimitExceeded(true);
        file = Array.prototype.slice.call(
          file,
          0,
          maxSelect - fileItems?.length < 0 ? 0 : maxSelect - fileItems?.length
        );
      }
      onChange(file);
    }

    if (["csv", "xls", "xlsx"].includes(dragNDropFor)) {
      var file = file[0];

      if (!file) return;

      const fileSize = file.size / 1024 / 1024;

      if (fileSize > 1) {
        // setDataLimitExceed(true);
        const requireObj = {
          dataLimitExceed: true,
          rawFile: file,
        };

        onChange(requireObj);

        return;
      }
      setFileDetails({
        fileName: file.name.split(".")[0],
        fileExtension: file.name.split(".")[1],
        fileSize: fileSize,
      });

      var FR = new FileReader();
      FR.onload = function (e: any) {
        var data = new Uint8Array(e.target.result);
        var workbook = read(data, { type: "array", sheetStubs: true });
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // header: 1 instructs xlsx to create an 'array of arrays'
        var result = utils.sheet_to_json(firstSheet, {
          raw: true,
        });

        console.log(result);
        setFileDetails((state) => ({
          ...state,
          fileDataLength: result.length,
        }));
        // setValue("audienceContact", result);
        // setDataLimitExceed(false);

        const requireObj = {
          details: {
            fileName: file.name.split(".")[0],
            fileExtension: file.name.split(".")[1],
            fileSize: fileSize,
          },
          data: result,
          dataLimitExceed: false,
          rawFile: file,
        };

        onChange(requireObj);
      };
      FR.readAsArrayBuffer(file);
    }
  };

  return (
    <Fragment>
      {!(maxSelect <= fileItems?.length) ? (
        <div
          id="upload-container"
          className="file-area d-flex wx__align-items-center wx__justify-content-center"
        >
          <div className="file-dummy">
            <div className="success">
              Great, your files are selected. Keep on.
            </div>
            <div className="default d-flex wx__align-items-center wx__justify-content-center">
              <WxIcon
                icon={icon}
                className="img_icon"
                size={50}
                variants={variants}
              />
              <div className="upload_info d-flex wx__flex-column ">
                <p>
                  Drag and Drop {dragNDropText} here or{" "}
                  <label htmlFor="upload-files">Browse on your computer</label>
                </p>
                <span>Recommended size:{recommendedText}</span>
              </div>
            </div>
          </div>
          <input
            type="file"
            name={dragNDropFor}
            id="upload-files"
            accept={accept}
            multiple={dragNDropFor === "video" ? false : multiple}
            onChange={(e) => onFileSelect(e.target.files)}
            disabled={isUploading || maxSelect <= fileItems?.length}
          />
        </div>
      ) : null}
      {maxSelect <= fileItems?.length ? (
        <WxAlert>
          You can not add more than {maxSelect} images. Please upgrade your
          &nbsp;<Link to={SETTINGS_PRICING_PLAN}>plan</Link> to add more.
        </WxAlert>
      ) : null}

      {/* preview images */}
      {dragNDropFor === "image" ? (
        <div
          id="image-container"
          className="wx__image_files-container"
          onDragOver={(e) => e.preventDefault}
        >
          {Object.keys(fileItems)?.map((_, index: number) => {
            let file: IFilePayload = fileItems[index];
            if (!(fileItems[index] instanceof File)) {
              file = {
                ...fileItems[index],
                previewUrl: imageURLGenerate(fileItems[index]?.previewUrl),
              };
            }
            const id = file.previewUrl;
            return (
              <div
                key={id}
                id={id}
                className="wx__image-container"
                onDragOver={(e) => onDragOver(e, index)}
                draggable={onOrderChange ? true : false}
                onDragStart={(e) => onDragStart(e, index, id)}
                onDragEnd={() => onDragEnd(id)}
                onClick={() => onSelect && onSelect(fileItems[index])}
              >
                <img
                  className="wx__image"
                  src={file?.previewUrl}
                  alt={file?.fileName}
                />
                <div
                  className={`image_hover ${
                    selectedImages?.findIndex(
                      (f) => f?.fileName === file?.fileName
                    ) >= 0
                      ? "checked"
                      : ""
                  }`}
                >
                  {onSelect ? (
                    <WxIcon variants="round" icon="check_circle" />
                  ) : null}
                  <div className="image_hover_icon">
                    {onOrderChange ? <WxIcon icon="drag_indicator" /> : null}
                    {onRemove ? (
                      <WxIcon
                        icon="close"
                        className="image_remove"
                        onClick={() => onRemove(fileItems[index], index)}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
          {isUploading ? <Preloader /> : null}
        </div>
      ) : null}

      {/*  preview video */}
      {dragNDropFor === "video" && fileItems.length ? (
        <div id="video-container" className="wx__video_files-container">
          <video controls src={fileItems[0]?.previewUrl} />
          {true && (
            <WxIcon
              onClick={() => setFileItems([])}
              className="closeIcon"
              icon="close"
            />
          )}
          {isUploading ? <Preloader /> : null}
        </div>
      ) : null}
    </Fragment>
  );
};

export default memo(MediaInput);
