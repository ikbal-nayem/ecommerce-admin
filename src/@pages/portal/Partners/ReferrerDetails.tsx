import WxMainFull from "@components/MainContentLayout/WxMainFull";
import WxNotFound from "@components/NotFound/WxNotFound";
import { WxFormHeader } from "@components/WxFormLayout";
import ProductTableSkelton from "@components/WxSkelton/ProductTableSkelton";
import WxTag from "@components/WxTag";
import { IPartnerPaymentInfo } from "@interfaces/portal.interface";
import { ProfileService } from "services/api/settings/Profile.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { statusColorMapping } from "utils/colorMap";
import { generateDateFormat } from "utils/splitDate";

export default function ReferrerDetails() {
  const [payments, setPayments] = useState<IPartnerPaymentInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams();

  useEffect(() => {
    ProfileService.getReferralPaymentInfo(id)
      .then((res) => setPayments(res.body))
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <WxMainFull>
      <WxFormHeader title="Partner payment details" />
      {isLoading ? (
        <div className="rounded w-100 wx__bg-white wx__mt-3">
          <ProductTableSkelton viewBox="0 0 600 230" />
        </div>
      ) : (
        <div className="card">
          {!isLoading && !payments?.length ? (
            <WxNotFound title="No payments information found!" />
          ) : null}

          {payments.length ? (
            <>
              <div className="wx__responsive_table">
                <table className="wx__table">
                  <thead className="wx__thead">
                    <tr className="wx__tr">
                      <th className="wx__th">Transaction date</th>
                      <th className="wx__th">Amount</th>
                      <th className="wx__th">Purchased plan</th>
                    </tr>
                  </thead>
                  <tbody className="wx__tbody">
                    {payments?.map((payment) => (
                      <tr className="wx__tr" key={payment?.id}>
                        <td className="wx__td">
                          {generateDateFormat(
                            payment?.tranDate,
                            "%MM% %date%, %yyyy%"
                          )}
                        </td>
                        <td className="wx__td">
                          {payment?.currency}{" "}
                          {payment?.payAmount?.toLocaleString()}
                        </td>
                        <td className="wx__td">
                          <WxTag
                            label={payment?.planTitle}
                            color={statusColorMapping(payment?.planTitle)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </div>
      )}
    </WxMainFull>
  );
}
