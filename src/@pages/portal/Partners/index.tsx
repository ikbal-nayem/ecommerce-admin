import WxMainFull from "@components/MainContentLayout/WxMainFull";
import WxNotFound from "@components/NotFound/WxNotFound";
import { WxFormHeader } from "@components/WxFormLayout";
import WxIcon from "@components/WxIcon/WxIcon";
import WxPagination from "@components/WxPagination/WxPagination";
import ProductTableSkelton from "@components/WxSkelton/ProductTableSkelton";
import WxTabs from "@components/WxTabs/WxTabs";
import WxTag from "@components/WxTag";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { IRequestMeta } from "@interfaces/common.interface";
import { IPartner } from "@interfaces/portal.interface";
import { PORTAL_PARTNERS_DETAILS } from "routes/path-name.route";
import { ProfileService } from "services/api/settings/Profile.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { statusColorMapping } from "utils/colorMap";
import { generateDateFormat } from "utils/splitDate";
import { imageURLGenerate } from "utils/utils";

const tabOptions = [
  { id: 0, title: "Free partner" },
  { id: 1, title: "Paid partner" },
];

export default function Partners() {
  const [partners, setPartners] = useState<IPartner[]>([]);
  const [partnersMeta, setPartnersMeta] = useState<IRequestMeta>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [paginationLimit, setPaginationLimit] = useState<number>(10);

  const [searchParam, setSearchParam] = useSearchParams();
  const tabIndex = searchParam.get("tabIndex") || 0;

  useEffect(() => {
    getPartners();
  }, [paginationLimit, currentPage, tabIndex]);

  const getPartners = () => {
    setIsLoading(true);
    ProfileService.referredGetList({
      body: { isPaidPartner: !!+tabIndex },
      meta: {
        offset: currentPage,
        limit: paginationLimit,
      },
    })
      .then((res) => {
        setPartners(res.body);
        setPartnersMeta(res.meta || {});
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <WxMainFull>
      <WxFormHeader title="Partner" />
      {isLoading ? (
        <div className="rounded w-100 bg-white mt-3">
          <ProductTableSkelton viewBox="0 0 600 230" />
        </div>
      ) : (
        <div className="card pt-3">
          <WxTabs
            option={tabOptions}
            renderTab={(item) => item?.title}
            currentIndex={+tabIndex}
            setCurrentIndex={(idx: any) =>
              setSearchParam({ tabIndex: idx }, { replace: true })
            }
          />
          {!isLoading && !partners?.length ? (
            <WxNotFound title="No partners found!" />
          ) : null}

          {partners.length ? (
            <>
              <div className="wx__responsive_table">
                <table className="wx__table">
                  <thead className="wx__thead">
                    <tr className="wx__tr">
                      <th className="wx__th" />
                      <th className="wx__th">Owner name</th>
                      <th className="wx__th">Joining date</th>
                      <th className="wx__th">Store name</th>
                      <th className="wx__th">Current plan</th>
                      <th className="wx__th">Next renewal date</th>
                      <th className="wx__th">First purchase date</th>
                      <th className="wx__th" />
                    </tr>
                  </thead>
                  <tbody className="wx__tbody">
                    {partners?.map((partner) => (
                      <tr className="wx__tr" key={partner?.storeId}>
                        <td className="wx__td pe-0" width={70}>
                          <WxThumbnail
                            src={imageURLGenerate(partner?.ownerImage)}
                          />
                        </td>
                        <td className="wx__td">
                          <div>
                            <strong>{partner?.ownerName || "---"}</strong>
                            <br />
                            {partner?.ownerPhone ? (
                              <>
                                <small className="text-muted">
                                  {partner?.ownerPhone}
                                </small>
                                <br />
                              </>
                            ) : null}
                            <small className="text-muted">
                              {partner?.ownerEmail}
                            </small>
                          </div>
                        </td>
                        <td className="wx__td">
                          {generateDateFormat(
                            partner?.joiningDate,
                            "%MM% %date%, %yyyy%"
                          )}
                        </td>
                        <td className="wx__td">{partner?.storeName}</td>
                        <td className="wx__td">
                          <WxTag
                            label={partner?.currentPlan}
                            color={statusColorMapping(partner.currentPlan)}
                          />
                        </td>
                        <td className="wx__td">
                          {generateDateFormat(
                            partner?.nextRenewalDate,
                            "%MM% %date%, %yyyy%"
                          )}
                        </td>
                        <td className="wx__td">
                          {partner?.purchaseDate
                            ? generateDateFormat(
                                partner?.purchaseDate,
                                "%MM% %date%, %yyyy%"
                              )
                            : "Yet not purchsed"}
                        </td>
                        <td className="wx__td" width={50}>
                          {!!partner?.purchaseDate ? (
                            <Link
                              to={PORTAL_PARTNERS_DETAILS({
                                id: partner?.storeId,
                              })}
                            >
                              <WxIcon icon="preview" size={30} />
                            </Link>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4">
                <WxPagination
                  meta={partnersMeta}
                  setCurrentPage={setCurrentPage}
                  setPaginationLimit={setPaginationLimit}
                />
              </div>
            </>
          ) : null}
        </div>
      )}
    </WxMainFull>
  );
}
