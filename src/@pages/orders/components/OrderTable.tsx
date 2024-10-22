import GenerateReactPDF from "@components/Invoice/GenerateReactPDF";
import WxDropdown from "@components/WxDropdown/WxDropdown";
import Icon from "@components/Icon";
import { IOrderList } from "@interfaces/order.interface";
import { pdf } from "@react-pdf/renderer";
import { ORDER_DETAILS } from "routes/path-name.route";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { saveAs } from "file-saver";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { statusColorMapping } from "utils/colorMap";
import { generateDateFormat } from "utils/splitDate";
import { generatePDF } from "./InvoiceUtil";

interface IOrdersTable {
  ordersData: IOrderList[];
  onDelete: any;
}

const OrderListTable = ({ ordersData, onDelete }: IOrdersTable) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [loader, setLoader] = useState<boolean>(false);

  // const {
  //   activePlan,
  //   user_data: { store_id },
  // } = useSelector((state: any) => state?.user);

  const { store_currency_code } = useSelector(
    (data: any) => data?.user?.user_data
  );

  const onShowPopup = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(0);
      setShowPopup(!showPopup);
      return;
    }
    setSelectedIndex(index);
    setShowPopup(!showPopup);
  };

  const invoicePrint = async (orderID) => {
    // setLoader(true);
    // generatePDF(
    //   store_id,
    //   orderID,
    //   async (data) => {
    //     const dd = {
    //       invoiceData: data?.invoiceData,
    //       invoiceItemData: data?.invoiceItemData,
    //     };
    //     try {
    //       const blob = await pdf(<GenerateReactPDF data={dd} />).toBlob();
    //       saveAs(blob, `${dd.invoiceData?.invoice?.customerName}.pdf`);
    //     } catch {
    //       ToastService.error("Failed to generate Invoice PDF!");
    //     } finally {
    //       setLoader(false);
    //     }
    //   },
    //   // handling error if API request failed
    //   () => {
    //     setLoader(false);
    //   }
    // );
  };

  return (
    <div id="printDIV" className="wx__responsive_table">
      {loader && <Preloader />}
      <table className="wx__table">
        <thead className="wx__thead">
          <tr className="wx__tr">
            <th className="wx__th">Order</th>
            <th className="wx__th">Date</th>
            <th className="wx__th">Customer</th>
            <th className="wx__th">Source Channel</th>
            <th className="wx__th">Total</th>
            <th className="wx__th">Payment Status</th>
            <th className="wx__th">Order Status</th>
          </tr>
        </thead>
        <tbody className="wx__tbody">
          {ordersData?.map((ord: any, index: number) => (
            <tr className="wx__tr" key={ord?.orderId}>
              <td className="wx__td">
                <Link
                  className="hover-underline"
                  to={ORDER_DETAILS({ order_id: ord?.orderId })}
                >
                  {ord?.orderNo}
                </Link>
              </td>
              <td className="wx__td">
                {generateDateFormat(
                  ord?.orderDate,
                  "%MM% %date%, %hour%:%minute%%ampm%, %yyyy%"
                )}
              </td>
              <td className="wx__td">{ord?.customerName}</td>
              <td className="wx__td">{ord?.saleChannel}</td>
              <td className="wx__td">
                {store_currency_code}&nbsp;
                {ord?.totalPayableAmount?.toLocaleString()}
              </td>
              <td className="wx__td">
                <div
                  className={`wx__btn_tags ${statusColorMapping(
                    ord?.paymentStatus
                  )}`}
                >
                  {ord?.paymentStatus}
                </div>
              </td>
              <td className="wx__td">
                <div
                  className={`wx__btn_tags ${statusColorMapping(
                    ord?.orderStatus
                  )}`}
                >
                  {ord?.orderStatus}
                </div>
              </td>
              <td className="wx__td more">
                <div className="wx__table_cell_more-icon">
                  <Icon
                    icon="more_vert"
                    id="triggerId"
                    onClick={() => onShowPopup(index)}
                  />
                  {selectedIndex === index && (
                    <WxDropdown
                      isOpen={showPopup}
                      setIsOpen={setShowPopup}
                      drop
                    >
                      <ul>
                        <li className="text_subtitle">
                          <Link
                            to={ORDER_DETAILS({ order_id: ord?.orderId })}
                            className="text_body"
                          >
                            <Icon style={{ top: "0" }} icon="edit" /> Edit
                          </Link>
                        </li>
                        {["pending", "delivered"].includes(
                          ord?.orderStatus?.toLowerCase()
                        ) ? (
                          <li
                            onClick={() => invoicePrint(ord?.orderId)}
                            className="text_subtitle"
                            style={{ cursor: "pointer" }}
                          >
                            <span className="text_body">
                              <Icon
                                style={{ top: "0" }}
                                icon="print"
                                color="primary"
                              />{" "}
                              Print Invoice
                            </span>
                          </li>
                        ) : null}
                        {["pending", "cancel"].includes(
                          ord?.orderStatus?.toLowerCase()
                        ) ? (
                          <li
                            className="text_subtitle delete"
                            onClick={() => onDelete(ord)}
                          >
                            <a className="text_body">
                              <Icon
                                style={{ top: "0" }}
                                icon="delete"
                                color="danger"
                              />
                              Delete
                            </a>
                          </li>
                        ) : null}
                      </ul>
                    </WxDropdown>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderListTable;
