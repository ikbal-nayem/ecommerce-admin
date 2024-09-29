import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxButton from "@components/WxButton";
import {
  WxFormContainer,
  WxFormFooter,
  WxFormHeader,
} from "@components/WxFormLayout";
import WxHr from "@components/WxHr";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import { STATUS_CONSTANT } from "config/constants";
import { IProductVariant } from "@interfaces/product.interface";
import { ORDER_DETAILS } from "routes/path-name.route";
import { OrderService } from "services/api/Order.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import BrowseProduct from "../components/BrowseProduct/BrowseProduct";
import PaymentInfo from "../components/payment-info/PaymentInfo";
import ProductCart from "../components/product-cart/ProductCart";

const UpdateOrder = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<IProductVariant[]>([]);
  const previousInfo = useRef<IProductVariant[]>([]);
  const { register, handleSubmit, watch, getValues, setValue, reset } =
    useForm();
  const { order_id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) getOrderDetails();
  }, [loading]);

  useEffect(() => {
    setValue("orderLineList", []);
    selectedProduct.forEach((item: any, idx) => {
      setValue(`orderLineList.${idx}.id`, item?.isNew ? null : item?.id);
      setValue(`orderLineList.${idx}.productId`, item.productId || item.id);
      setValue(
        `orderLineList.${idx}.productVariantCombinationId`,
        item.variantId || item.productVariantCombinationId
      );
      setValue(`orderLineList.${idx}.quantity`, item.quantity);
    });
  }, [selectedProduct]);

  const getOrderDetails = () => {
    if (!order_id) return;
    OrderService.getDetails({ body: { id: order_id } })
      .then((res) => {
        if (res.body.orderStatus === STATUS_CONSTANT.delivered) {
          navigate(ORDER_DETAILS({ order_id: order_id }));
          return;
        }
        reset(res.body);
        previousInfo.current = JSON.parse(
          JSON.stringify(res.body?.orderLineList)
        );
        setSelectedProduct(res.body?.orderLineList);
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setLoading(false));
  };
  // TODO:: need to optimization
  const addToCart = (product: IProductVariant) => {
    const id = product.variantId || product.id;
    const product_copy: any = { ...product };
    const newProductList = [...selectedProduct];
    const idx = newProductList.findIndex(
      (item: any) =>
        item?.productVariantCombinationId === id || item.productId === id
    );

    if (idx === -1) {
      product_copy.productId = product.id;
      if (product.variantId)
        product_copy.productVariantCombinationId = product.variantId;
      product_copy.quantity = 1;
      product_copy.subTotal =
        product_copy?.sellingPrice || product_copy?.regularPrice;
      product_copy.isNew = true;
      newProductList.push(product_copy);
    } else {
      newProductList[idx].quantity += 1;
      newProductList[idx].subTotal =
        newProductList[idx].quantity *
        (product_copy?.sellingPrice || product_copy?.regularPrice);
    }
    setSelectedProduct([...newProductList]);
  };

  const removeFromCart = (product: IProductVariant, index) => {
    // const id = product.variantId || product.id;
    // const newProductList = [...selectedProduct];
    // const idx = newProductList.findIndex(
    //   (item) => (item?.variantId || item.id) === id
    // );
    if (!selectedProduct[index]) return;
    selectedProduct.splice(index, 1);
    setSelectedProduct([...selectedProduct]);
  };

  const updateQuantity = (productIndex: number, qty: number) => {
    const newProductList = [...selectedProduct];
    newProductList[productIndex].quantity = qty;
    newProductList[productIndex].subTotal =
      qty *
        (newProductList[productIndex].sellingPrice ||
          newProductList[productIndex].regularPrice) || 0;
    // console.log(newProductList);
    setSelectedProduct([...newProductList]);
  };

  const openDrawer = () => setDrawerOpen(true);
  const handleClose = () => setDrawerOpen(false);

  const onSubmitting = (requestData: any) => {
    setSaving(true);
    requestData.orderDate = new Date().toISOString().split("T")[0];
    OrderService.update(requestData)
      .then((resp) => {
        ToastService.success(resp.message);
        navigate(ORDER_DETAILS({ order_id }));
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setSaving(false));
  };

  if (loading) return <Preloader />;

  return (
    <WxMainLg>
      <WxFormContainer>
        <WxFormHeader
          title="Edit Order"
          backNavigationLink={ORDER_DETAILS({ order_id })}
        />
        <form onSubmit={handleSubmit(onSubmitting)}>
          <div className="wx__row">
            <div className="wx__col-lg-8 wx__col-md-7 wx__col-sm-12 wx__mt-4">
              <div className="wx__card wx__p-0">
                <h5 className="wx__mb-3 wx__p-3 wx__pb-0">Product</h5>
                <div className="wx__d-flex wx__ps-3 wx__pe-3">
                  <div className="wx__input-group search">
                    <WxInput
                      type="search"
                      placeholder="Search products"
                      startIcon={<WxIcon icon="search" />}
                      onFocus={openDrawer}
                    />
                  </div>
                </div>
                <ProductCart
                  selectedProduct={selectedProduct}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  previousInfo={previousInfo.current}
                />
              </div>
              <PaymentInfo
                selectedProduct={selectedProduct}
                watch={watch}
                getValues={getValues}
                setValue={setValue}
              />
              <div className="wx__card wx__p-3">
                <div className="wx__col-md-12 wx__col-sm-12">
                  <WxInput
                    label="Reason for edit"
                    noMargin
                    registerProperty={{ ...register("editReason") }}
                  />
                </div>
              </div>
            </div>
            <div className="wx__col-lg-4 wx__col-md-5 wx__col-sm-12 wx__mt-4">
              <div className="wx__card wx__p-3 ">
                <WxButton type="submit" variant="fill" disabled={saving}>
                  Update Order {saving ? <Preloader /> : null}
                </WxButton>
                <WxHr />
                <section>
                  <h6 className="wx__text_h6 wx__text_semibold">Summary</h6>
                  <div className="wx__d-flex wx__justify-content-between">
                    <span>Updated Total </span>
                    <span>
                      BDT{" "}
                      {getValues("totalPayableAmount")?.toLocaleString() || 0}
                    </span>
                  </div>
                </section>
              </div>
            </div>
          </div>
          <WxFormFooter
            title="Unsaved Changes"
            saveButtonText="Update order"
            onCancel={() => navigate(ORDER_DETAILS({ order_id }))}
            isSaving={saving}
          />
        </form>
        <BrowseProduct
          drawerOpen={drawerOpen}
          handleClose={handleClose}
          addToCart={addToCart}
        />
      </WxFormContainer>
    </WxMainLg>
  );
};

export default UpdateOrder;
