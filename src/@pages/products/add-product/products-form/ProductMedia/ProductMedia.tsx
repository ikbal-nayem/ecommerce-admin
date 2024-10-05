import BlockSection from "@components/BlockSection/BlockSection";
import MediaInput from "@components/MediaInput/MediaInput";
import { IFilePayload } from "@interfaces/common.interface";
import { ProductService } from "services/api/products/Product.services";
import { ToastService } from "services/utils/toastr.service";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { compressImage } from "utils/utils";
import "./ProductMedia.scss";

type IProductMediaProps = {
  isEditForm?: boolean;
};

const ProductMedia = ({ isEditForm }: IProductMediaProps) => {
  const [imageList, setImageList] = useState<(IFilePayload | File)[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isDeleting, setIsDeletion] = useState<boolean>(false);
  const isInit = useRef(true);

  const { activePlan } = useSelector((state: any) => state?.user);

  const { setValue, getValues } = useFormContext();

  useEffect(() => {
    !isInit.current && setValue("images", imageList);
  }, [imageList, isInit.current]);

  useEffect(() => {
    if (isInit.current) {
      const images = getValues("images") || [];
      setImageList(images);
    }
    isInit.current = false;
  }, []);

  const handleImageAdd = useCallback(
    (images: File[]) => {
      Promise.all(Array.from(images).map((image) => compressImage(image))).then(
        (compressedImgs) => {
          if (!isEditForm) {
            setImageList([...imageList, ...compressedImgs]);
            return;
          }
          setUploading(true);
          const productId = getValues("id");
          const formData: any = new FormData();
          compressedImgs?.forEach((cImg) => formData.append("files", cImg));
          formData.append("id", productId);
          ProductService.uploadImages(formData)
            .then((resp) => setImageList([...imageList, ...resp.body]))
            .catch((err) => ToastService.error(err.message))
            .finally(() => setUploading(false));
        }
      );
    },
    [imageList, isEditForm]
  );

  const handleImageOrderChange = useCallback((imgList: IFilePayload[]) => {
    setImageList([...imgList]);
  }, []);

  const handleRemove = useCallback(
    (imageData: IFilePayload, index: number) => {
      if (!isEditForm) {
        const imgList = [...imageList];
        imgList.splice(index, 1);
        setImageList(imgList);
        return;
      }
      setIsDeletion(true);
      ProductService.deleteImages({ file: imageData, id: getValues("id") })
        .then((resp) => {
          const imgList = [...imageList];
          imgList.splice(index, 1);
          setImageList(imgList);
        })
        .catch((err) => ToastService.error(err.message))
        .finally(() => setIsDeletion(false));
    },
    [imageList, isEditForm]
  );

  return (
    <div className="wx__product_media card card p-3 mt-4">
      <h6 className="text_semibold text_h6">Media</h6>
      <BlockSection isblocked={isDeleting} hasLoader={true}>
        <MediaInput
          multiple
          fileList={imageList}
          maxSelect={activePlan?.productImageCount}
          onChange={handleImageAdd}
          onOrderChange={handleImageOrderChange}
          onRemove={handleRemove}
          isUploading={uploading}
        />
      </BlockSection>
    </div>
  );
};

export default memo(ProductMedia);
