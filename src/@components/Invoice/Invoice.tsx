import WxIcon from "@components/WxIcon/WxIcon";
import { createRef, useRef } from "react";
import { generateDateFormat } from "utils/splitDate";
import { imageURLGenerate } from "utils/utils";
import webXLogo from "../../assets/svg/webx-logo.svg";
import "./Invoice.scss";

interface IInvoice {
  invoiceData?: any;
}

const Invoice = ({ invoiceData }) => {
  const testRef = useRef(null);
  const certificateTemplateRef = useRef<any>(null);

  const {
    invoice: {
      customerName = "",
      orderDate = new Date(),
      orderNote = "free shipping with 30 days with money back guaranteed",
      orderSubTotal = 0,
      taxAmount = 0,
      deliveryChargeAmount = 0,
      totalPayableAmount = 0,
      shippingAddress: {
        addressLine1 = "",
        addressLine2 = "",
        cityName = "",
        country = "",
        email = "",
        fullAddress = "",
        phone = "",
        postCode = "",
        state = "",
      } = {},
      orderLineList = [],
      invoice: { invoiceNo = "", orderStatusId = "", payAmount = "" } = {},
    } = {},
    store: {
      store: { name: storeName = "", businessName = "" } = {},
      storeConfig: { siteLogoUrl = "" } = {},
      storeWarehouse: [
        {
          addressLine1: WH1addressLine1 = "",
          addressLine2: WH1addressLine2 = "",
          city: WH1cityName = "",
          country: WH1country = "",
          email: WH1email = "",
          id: WH1id = "",
          phone: WH1phone = "",
          state: WH1state = "",
          storeId: WH1storeId = "",
          title: WH1title = "",
          zip: WH1postCode = "",
        } = {},
        wearHouse2,
      ] = [],
    } = {},
  } = invoiceData;

  const ref = createRef<any>();
  const options = {
    orientation: "portrait",
    unit: "px",
    scale: 1.5,
  };

  return (
    <div id="invoiceDIV">
      <div className="main-page">
        <div className="sub-page">
          {/* topper */}
          <div className="topper">
            <div className="wx__d-flex wx__justify-content-between">
              <img src={imageURLGenerate(siteLogoUrl)} alt="" />
              <div className="wx__d-flex wx__flex-column wx__align-items-end">
                <h6 className="wx__mb-0 wx__text">INVOICE NO #{invoiceNo}</h6>
                <span className="wx__text_body">
                  {generateDateFormat(
                    orderDate,
                    "%date% %MM%, %hour%.%minute%%ampm%"
                  )}
                </span>
              </div>
            </div>
            <hr />
          </div>

          {/* footer */}
          <div className="footer">
            <hr />
            <div className="wx__d-flex wx__align-items-center wx__justify-content-between">
              <div>
                <div>
                  <img src={webXLogo} alt="" />
                </div>
                <span>Invoice powered by WebX.xyz</span>
              </div>
              <div>
                <i>Thank you for shopping with us!</i>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <td>
                  <div className="topper-space"></div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="invoice_address wx__d-flex  wx__justify-content-between">
                    <div>
                      <h6>Bill Form</h6>
                      <p className="wx__text__semibold wx__text_body">
                        {businessName}
                      </p>
                      <br />
                      <p className="wx__text__semibold wx__text_body">
                        {WH1addressLine1} {WH1addressLine2}
                      </p>
                      <br />
                      <p className="wx__text__semibold wx__text_body">
                        {WH1postCode && WH1postCode + "-"}
                        {WH1cityName && WH1cityName + ", "} {WH1country}
                      </p>
                      <br />
                      <p className="wx__text__semibold wx__text_body">
                        {WH1phone}
                      </p>
                      <br />
                      <p className="wx__text__semibold wx__text_body">
                        {WH1email}
                      </p>
                    </div>
                    <div>
                      <h6>Ship To</h6>
                      <p className="wx__text__semibold wx__text_body">
                        {customerName || "no name found"}
                      </p>
                      <br />
                      <p className="wx__text__semibold wx__text_body">
                        {addressLine1} {addressLine2}
                      </p>
                      <br />
                      <p className="wx__text__semibold wx__text_body">
                        {postCode && postCode + "-"}
                        {cityName && cityName + ", "} {country}
                      </p>
                      <br />
                      <p className="wx__text__semibold wx__text_body">
                        {phone}
                      </p>
                      <br />
                      <p className="wx__text__semibold wx__text_body">
                        {email}
                      </p>
                    </div>
                  </div>

                  <table className="wx__mt-4" id="orderListTable">
                    <thead>
                      <tr>
                        <th>
                          <span className="wx__text_regular">Item</span>
                        </th>
                        <th>
                          {" "}
                          <span className="wx__text_regular">Quantity</span>
                        </th>
                        <th>
                          <span className="wx__text_regular">Amount</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderLineList.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="wx__d-flex ">
                                {/* <div className="table_img wx__me-2">
                                  <img
                                    src={item.thumbnail}
                                    alt=""
                                    className="item_img"
                                  />
                                </div> */}
                                <div>
                                  <p className="wx__mb-0 wx__text_semibold">
                                    {item?.title}
                                  </p>
                                  {item?.options && item?.options?.length
                                    ? item?.options.map((variant, indx) => {
                                        return (
                                          <span
                                            key={indx}
                                            className="wx__text-secondary wx__text_small"
                                          >
                                            {indx > 0 ? ", " : ""}
                                            {variant?.key}-{variant?.value}
                                          </span>
                                        );
                                      })
                                    : null}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="wx__text-center wx__text__semibold invoice_text">
                                {+item?.quantity > 9
                                  ? item?.quantity
                                  : "0" + item?.quantity}
                              </div>
                            </td>
                            <td>
                              <div className="wx__text-center wx__text__semibold invoice_text">
                                {item?.subTotal || 0} BDT
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="wx__row wx__mt-2">
                    <div className="wx__col-5">
                      {orderNote && (
                        <div className="wx__invoice_notes">
                          <p>
                            <WxIcon icon="info" />
                            <span className="wx__text_semibold ms_2">
                              NOTES
                            </span>
                          </p>
                          <span>{orderNote}</span>
                        </div>
                      )}
                    </div>
                    <div className="wx__col-7">
                      <div className="order_summery">
                        <div className="wx__d-flex wx__justify-content-between">
                          <span className="wx__text__semibold wx__text_body">
                            Sub Total
                          </span>
                          <span className="wx__text__semibold wx__text_body">
                            {orderSubTotal || "0"} BDT
                          </span>
                        </div>
                        <div className="wx__d-flex wx__justify-content-between">
                          <span className="wx__text__semibold wx__text_body">
                            Tax
                          </span>
                          <span className="wx__text__semibold wx__text_body">
                            {taxAmount || "0"} BDT
                          </span>
                        </div>
                        <div className="wx__d-flex wx__justify-content-between">
                          <span className="wx__text__semibold wx__text_body">
                            Delivery Charge
                          </span>
                          <span className="wx__text__semibold wx__text_body">
                            {deliveryChargeAmount || "0"} BDT
                          </span>
                        </div>
                        <div className="wx__d-flex wx__justify-content-between total">
                          <span className="wx__text_semibold">Total</span>
                          <span className="wx__text_semibold">
                            {totalPayableAmount || "0"} BDT
                          </span>
                        </div>
                        <div className="wx__d-flex wx__justify-content-between wx__my-2">
                          <span className="wx__text__semibold wx__text_body">
                            Paid
                          </span>
                          <span className="wx__text__semibold wx__text_body">
                            {totalPayableAmount || "0"} BDT
                          </span>
                        </div>
                        <div className="wx__d-flex wx__justify-content-between">
                          <h5 className="wx__text-secondary wx__text_semibold">
                            Total Due
                          </h5>
                          <h5 className="wx__text-secondary wx__text_semibold">
                            {totalPayableAmount || "0"} BDT
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <div className="footer-space"></div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
