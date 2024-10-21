import WxMainLg from "@components/MainContentLayout/MainLg";
import {Button} from "@components/Button";
import {
  WxFormContainer,
  WxFormFooter,
  FormHeader,
} from "@components/FormLayout";
import WxHr from "@components/WxHr";
import WxIcon from "@components/Icon";
import TextInput from "@components/TextInput";
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
        <FormHeader
          title="Edit Order"
          backNavigationLink={ORDER_DETAILS({ order_id })}
        />
        <form onSubmit={handleSubmit(onSubmitting)}>
          <div className="row">
            <div className="col-lg-8 col-md-7 col-sm-12 mt-4">
              <div className="card p-0">
                <h5 className="mb-3 p-3 pb-0">Product</h5>
                <div className="d-flex ps-3 pe-3">
                  <div className="input-group search">
                    <TextInput
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
              <div className="card p-3">
                <div className="col-md-12 col-sm-12">
                  <TextInput
                    label="Reason for edit"
                    noMargin
                    registerProperty={{ ...register("editReason") }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-5 col-sm-12 mt-4">
              <div className="card p-3 ">
                <Button type="submit" variant="fill" disabled={saving}>
                  Update Order {saving ? <Preloader /> : null}
                </Button>
                <WxHr />
                <section>
                  <h6 className="text_h6 text_semibold">Summary</h6>
                  <div className="d-flex justify-content-between">
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
