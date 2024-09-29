import { IOrderList } from "@interfaces/order.interface";
import { CAMPAIGNS } from "routes/path-name.route";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { generateDateFormat } from "utils/splitDate";

interface ICampaignTable {
  campaignData: IOrderList[];
}

const CampaignTable = ({ campaignData }: ICampaignTable) => {
  const [searchParams] = useSearchParams();

  const { store_currency_code } = useSelector(
    (data: any) => data?.user?.user_data
  );

  return (
    <div id="printDIV" className="wx__responsive_table">
      <table className="wx__table">
        <thead className="wx__thead">
          <tr className="wx__tr">
            <th className="wx__th">Campaign Name</th>
            <th className="wx__th">Audience</th>
            <th className="wx__th">Status</th>
            <th className="wx__th">Delivery Time</th>
          </tr>
        </thead>
        <tbody className="wx__tbody">
          {campaignData?.map((campaign: any) => (
            <tr className="wx__tr" key={campaign?.id}>
              <td className="wx__td">
                <Link
                  to={
                    CAMPAIGNS +
                    "/update?campaign=" +
                    searchParams.get("type") +
                    "&id=" +
                    campaign?.id
                  }
                  state={campaign}
                >
                  {campaign?.name}
                </Link>
              </td>
              <td className="wx__td">{campaign?.expectedAudience}</td>
              <td className="wx__td">{campaign?.status}</td>
              <td className="wx__td">
                {generateDateFormat(
                  campaign?.deliveryTime,
                  "%MM% %date%, %hour%:%minute%%ampm%, %yyyy%"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignTable;
