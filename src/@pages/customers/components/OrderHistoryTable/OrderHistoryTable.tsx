import React, { Fragment } from "react";
import "./OrderHistoryTable.scss";

const OrderHistoryTable = () => {
  return (
    <Fragment>
      <h5>Order History</h5>
      <table className="">
        <thead className="">
          <tr className="">
            <th className="" style={{}}>
              <div className="text_subtitle text_semibold">Order</div>
            </th>
            <th className="" style={{}}>
              <div className="text_subtitle text_semibold">Date</div>
            </th>
            {/* <th className="" style={{ width: "324px" }}></th> */}
            <th className="" style={{}}>
              <div className="text_subtitle text_semibold">
                Source Channel
              </div>
            </th>
            <th className="" style={{}}>
              <div className="text_subtitle text_semibold">Items</div>
            </th>
            <th className="" style={{}}>
              <div className="text_subtitle text_semibold">Total</div>
            </th>
            <th className="" style={{}}>
              <div className="text_subtitle text_semibold">
                Payment Status
              </div>
            </th>
            <th className="" style={{}}>
              <div className="text_subtitle text_semibold">
                Order Status
              </div>
            </th>
            <th className="" style={{}}>
              <div className="text_subtitle text_semibold"></div>
            </th>
            <th className="" style={{}}></th>
          </tr>
        </thead>
        <tbody className="">
          <tr className="">
            <td className="">
              <div>#1099</div>
            </td>
            <td className="">
              <div>jul 23,5:12pm</div>
            </td>
            <td className="">
              <div>POS</div>
            </td>
            <td className="">
              <div>12</div>
            </td>
            <td className="">
              <div>$3400</div>
            </td>
            <td className="">
              <div>pending</div>
            </td>
            <td className="">
              <div>unfullfiled</div>
            </td>
            <td className="">
              <div>dot dot dot</div>
            </td>
          </tr>
        </tbody>
      </table>
    </Fragment>
  );
};

export default OrderHistoryTable;
