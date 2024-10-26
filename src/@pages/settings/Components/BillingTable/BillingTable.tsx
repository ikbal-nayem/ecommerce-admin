import {Button} from "@components/Button";
import Icon from "@components/Icon";
import WxTag from "@components/WxTag";
import { STATUS_CONSTANT } from "config/constants";
import { PAYMENT } from "routes/path-name.route";
import { InvoiceService } from "services/api/Invoice.service";
import { useNavigate } from "react-router-dom";
import { statusColorMapping } from "utils/colorMap";
import { generateDateFormat } from "utils/splitDate";
// import { statusColorMapping } from "utils/utils";

interface IBillingTable {
  tableData: any[];
}

export const BillingTable = ({ tableData }: IBillingTable) => {
  const navigate = useNavigate();

  return (
    <div className="wx__responsive_table">
      <table className="wx__table user_role_table">
        <thead className="wx__thead">
          <tr className="wx__tr">
            <th className="wx__th">Date</th>
            <th className="wx__th">Description</th>
            <th className="wx__th" align="right">
              Invoice Amount
            </th>
            <th className="wx__th">Purchase Status</th>
            <th className="wx__th">Payment Status</th>
            <th className="wx__th">Download Invoice</th>
          </tr>
        </thead>
        <tbody className="wx__tbody">
          {tableData?.map((bill: any) => (
            <tr className="wx__tr" key={bill?.id}>
              <td className="wx__td">
                {generateDateFormat(bill?.purchaseDate, "%date% %MM%, %yyyy%")}
              </td>
              <td className="wx__td">{bill?.serviceDescription || "---"}</td>
              <td className="wx__td" align="right">
                {bill?.invoicePayAmount}
              </td>
              <td className="wx__td">
                <WxTag
                  // color={statusColorMapping(bill?.invoiceOrderStatus)}
                  label={bill?.invoiceOrderStatus}
                />
              </td>
              <td className="wx__td">
                <WxTag
                  // color={statusColorMapping(bill?.merchantPaymentStatus)}
                  label={bill?.merchantPaymentStatus}
                />
              </td>
              <td className="wx__td d-flex">
                <Button
                  onClick={() =>
                    InvoiceService.downloadInvoice(bill?.invoiceId)
                  }
                >
                  <Icon style={{ top: "0" }} icon="download" /> Download
                </Button>
                {bill?.invoicePaymentStatus !== STATUS_CONSTANT.paid ? (
                  <div>
                    <Button
                      className="mx-3 btn-sm"
                      variant="fill"
                      onClick={() =>
                        navigate(PAYMENT + "?invoiceId=" + bill?.invoiceId)
                      }
                      size="sm"
                    >
                      Pay Now
                    </Button>
                  </div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
