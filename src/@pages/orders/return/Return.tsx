import MainLg from "@components/MainContentLayout/MainLg";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import TextInput from "@components/TextInput";
import { IProductVariant } from "@interfaces/product.interface";
import { ORDER_DETAILS } from "routes/path-name.route";
import { OrderService } from "services/api/Order.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ProductRefundCart from "../components/product-cart/ProductRefundCart";

interface IRefandableInfo {
  amount?: number;
  quantity?: number;
}

const defaultRefandableInfo: IRefandableInfo = {
  amount: 0,
  quantity: 0,
};

const OrderReturn = () => {
  const { order_id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [productList, setProductList] = useState<IProductVariant[]>([]);
  const [returnItems, setReturnItems] = useState<IProductVariant[]>([]);
  const [returnableInfo, setReturnInfo] = useState<IRefandableInfo>(
    defaultRefandableInfo
  );
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [customerId, setCustomerId] = useState<string>("");
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<any>();

  useEffect(() => {
    if (returnItems.length) {
      let amount = 0.0;
      let quantity = 0;
      returnItems.map((item: IProductVariant) => {
        amount = amount + item.sellingPrice * item.quantity;
        quantity = quantity + item.quantity;
      });
      setReturnInfo({
        amount,
        quantity,
      });
    }
  }, [returnItems]);

  useEffect(() => {
    if (!order_id) return;
    OrderService.getDetails({ body: { id: order_id } })
      .then((res) => {
        setProductList(res.body?.orderLineList);
        const refundList = res.body?.orderLineList?.map((item) => ({
          ...item,
          quantity: 0,
        }));
        setCustomerId(res.body.customerId);
        setReturnItems(refundList);
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setLoading(false));
  }, [order_id]);

  const onIncrease = (index: number) => {
    const newRefundItems = [...returnItems];
    if (newRefundItems[index].quantity < productList[index].quantity)
      newRefundItems[index].quantity += 1;
    setReturnItems(newRefundItems);
  };
  const onDecrease = (index: number) => {
    const newRefundItems = [...returnItems];
    if (newRefundItems[index].quantity > 0) newRefundItems[index].quantity -= 1;
    setReturnItems(newRefundItems);
  };

  const onSubmit = (data: any) => {
    if (returnableInfo.quantity <= 0) {
      ToastService.info("Return quantity must be greater then 0!");
      return;
    }
    setIsSubmiting(true);
    const items = returnItems.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productVariantCombinationId: item.productVariantCombinationId,
      quantity: item.quantity,
      orderDescription: null,
      productLotId: null,
      orderStatusId: null,
      paymentStatusId: null,
    }));
    const requestData = {
      customerId: customerId,
      id: order_id,
      customerSessionId: null,
      orderLineList: items,
      refundReason: data.reason,
    };

    OrderService.returnStore(requestData)
      .then((res) => {
        ToastService.success(res.message);
        navigate(ORDER_DETAILS({ order_id }));
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsSubmiting(false));
  };

  return (
    <MainLg>
      <FormHeader
        title="Return Order"
        backNavigationLink={ORDER_DETAILS({ order_id })}
      />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="row">
          <div className="col-lg-8 col-md-7 col-sm-12">
            <div className="card p-3 mt-3">
              {loading ? (
                <Preloader />
              ) : (
                <ProductRefundCart
                  products={productList}
                  refundItems={returnItems}
                  handleIncrease={onIncrease}
                  handleDecrease={onDecrease}
                />
              )}
              <p className="m-3 text_small wx_text_regular text-muted">
                Returned items will be removed from the order
              </p>
            </div>
            <div className="card mt-3 p-3">
              <h6 className="text_h6 text_semibold">Return Reason</h6>
              <TextInput
                helpText="Only you and your staff can see ths reason"
                noMargin
                registerProperty={{ ...register("reason") }}
              />
            </div>
          </div>
          <div className="col-lg-4 col-md-5 col-sm-12">
            <div className="card p-3 mt-3">
              <h6 className="text_h6 text_semibold">Summary</h6>
              <span className="text_body text_italic">
                {returnableInfo.quantity} Items will be returned.
              </span>
              <hr />
              <Button
                color="primary"
                variant="fill"
                type="submit"
                disabled={isSubmiting || returnableInfo.quantity <= 0}
              >
                Return {isSubmiting && <Preloader />}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </MainLg>
  );
};

export default OrderReturn;
