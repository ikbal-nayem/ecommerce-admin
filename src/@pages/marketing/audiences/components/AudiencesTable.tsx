import WxTag from "@components/WxTag";
import { IOrderList } from "@interfaces/order.interface";
import { AUDIENCES } from "routes/path-name.route";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

interface ICampaignTable {
  audienceData: IOrderList[];
}

const AudiencesTable = ({ audienceData }: ICampaignTable) => {
  const { store_currency_code } = useSelector(
    (data: any) => data?.user?.user_data
  );
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div id="printDIV" className="wx__responsive_table">
      <table className="wx__table">
        <thead className="wx__thead">
          <tr className="wx__tr">
            <th className="wx__th">Title</th>
            <th className="wx__th">Type</th>
            <th className="wx__th">Total Contact</th>
          </tr>
        </thead>
        <tbody className="wx__tbody">
          {audienceData?.map((item: any) => {
            item.tag =
              item.type === "MARKETING_AUDIENCE_SMS" ? "sms" : "others";
            return (
              <tr className="wx__tr" key={item?.id}>
                <td className="wx__td">
                  <Link
                    to={{
                      pathname:
                        AUDIENCES +
                        "/update?audience=" +
                        searchParams.get("type") +
                        "&id=" +
                        item?.id,
                    }}
                    state={item}
                  >
                    {item?.title}
                  </Link>
                </td>
                <td className="wx__td">
                  <WxTag label={item?.tag} color="primary" />
                </td>
                <td className="wx__td">{item?.totalContact}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AudiencesTable;
