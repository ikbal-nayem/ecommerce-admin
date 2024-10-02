import WxIcon from "@components/Icon";
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
            <div className="d-flex justify-content-between">
              <img src={imageURLGenerate(siteLogoUrl)} alt="" />
              <div className="d-flex flex-column align-items-end">
                <h6 className="mb-0 text">INVOICE NO #{invoiceNo}</h6>
                <span className="text_body">
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
            <div className="d-flex align-items-center justify-content-between">
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
                  <div className="invoice_address d-flex  justify-content-between">
                    <div>
                      <h6>Bill Form</h6>
                      <p className="text__semibold text_body">
                        {businessName}
                      </p>
                      <br />
                      <p className="text__semibold text_body">
                        {WH1addressLine1} {WH1addressLine2}
                      </p>
                      <br />
                      <p className="text__semibold text_body">
                        {WH1postCode && WH1postCode + "-"}
                        {WH1cityName && WH1cityName + ", "} {WH1country}
                      </p>
                      <br />
                      <p className="text__semibold text_body">
                        {WH1phone}
                      </p>
                      <br />
                      <p className="text__semibold text_body">
                        {WH1email}
                      </p>
                    </div>
                    <div>
                      <h6>Ship To</h6>
                      <p className="text__semibold text_body">
                        {customerName || "no name found"}
                      </p>
                      <br />
                      <p className="text__semibold text_body">
                        {addressLine1} {addressLine2}
                      </p>
                      <br />
                      <p className="text__semibold text_body">
                        {postCode && postCode + "-"}
                        {cityName && cityName + ", "} {country}
                      </p>
                      <br />
                      <p className="text__semibold text_body">
                        {phone}
                      </p>
                      <br />
                      <p className="text__semibold text_body">
                        {email}
                      </p>
                    </div>
                  </div>

                  <table className="mt-4" id="orderListTable">
                    <thead>
                      <tr>
                        <th>
                          <span className="text_regular">Item</span>
                        </th>
                        <th>
                          {" "}
                          <span className="text_regular">Quantity</span>
                        </th>
                        <th>
                          <span className="text_regular">Amount</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderLineList.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex ">
                                {/* <div className="table_img me-2">
                                  <img
                                    src={item.thumbnail}
                                    alt=""
                                    className="item_img"
                                  />
                                </div> */}
                                <div>
                                  <p className="mb-0 text_semibold">
                                    {item?.title}
                                  </p>
                                  {item?.options && item?.options?.length
                                    ? item?.options.map((variant, indx) => {
                                        return (
                                          <span
                                            key={indx}
                                            className="text-secondary text_small"
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
                              <div className="text-center text__semibold invoice_text">
                                {+item?.quantity > 9
                                  ? item?.quantity
                                  : "0" + item?.quantity}
                              </div>
                            </td>
                            <td>
                              <div className="text-center text__semibold invoice_text">
                                {item?.subTotal || 0} BDT
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="row mt-2">
                    <div className="col-5">
                      {orderNote && (
                        <div className="wx__invoice_notes">
                          <p>
                            <WxIcon icon="info" />
                            <span className="text_semibold ms_2">
                              NOTES
                            </span>
                          </p>
                          <span>{orderNote}</span>
                        </div>
                      )}
                    </div>
                    <div className="col-7">
                      <div className="order_summery">
                        <div className="d-flex justify-content-between">
                          <span className="text__semibold text_body">
                            Sub Total
                          </span>
                          <span className="text__semibold text_body">
                            {orderSubTotal || "0"} BDT
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text__semibold text_body">
                            Tax
                          </span>
                          <span className="text__semibold text_body">
                            {taxAmount || "0"} BDT
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text__semibold text_body">
                            Delivery Charge
                          </span>
                          <span className="text__semibold text_body">
                            {deliveryChargeAmount || "0"} BDT
                          </span>
                        </div>
                        <div className="d-flex justify-content-between total">
                          <span className="text_semibold">Total</span>
                          <span className="text_semibold">
                            {totalPayableAmount || "0"} BDT
                          </span>
                        </div>
                        <div className="d-flex justify-content-between my-2">
                          <span className="text__semibold text_body">
                            Paid
                          </span>
                          <span className="text__semibold text_body">
                            {totalPayableAmount || "0"} BDT
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <h5 className="text-secondary text_semibold">
                            Total Due
                          </h5>
                          <h5 className="text-secondary text_semibold">
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
