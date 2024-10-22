import DateInput from "@components/DatePicker/DateInput";
import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxHr from "@components/WxHr";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import ChartBoxHeader from "@components/WxSkelton/Analytics/ChartBoxHeader";
import ConversionRate from "@components/WxSkelton/Analytics/ConverstionRate";
import SessionLandingSkelton from "@components/WxSkelton/Analytics/SessionLandingSkelton";
import { AnalyticsService } from "services/api/settings/Analytics.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { lazy, Suspense, useEffect, useState } from "react";
import skeltonLoader from "utils/skeltonLoader";
import { dateFormate } from "utils/splitDate";
import { dateAction, dateCompare, formateNumber } from "utils/utils";
import "./Analytics.scss";
const D3Chart = lazy(() => import("./components/D3Chart/D3Chart"));

const Analytics = () => {
  const [totalSales, setTotalSales] = useState<any[]>([]);
  const [avgOrderValue, setAvgOrderValue] = useState<any[]>([]);
  const [totalOrder, setTotalOrder] = useState<any[]>([]);
  const [avgSalesHistoryData, setAvgSalesHistoryData] = useState<any[]>([]);

  const [menu, setMenu] = useState(false);

  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [valueFor, setValueFor] = useState<string>("today");
  const [startDate, endDate] = dateRange;

  const [products, setProducts] = useState<any[]>([]);

  // loader states

  const [allContentLoader, setAllContentLoader] = useState<boolean>(true);

  const [analyticsData, setAnalyticsData] = useState<any>({
    totalSales: 0,
    totalUniqueOrders: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    onlineStoreConversionRate: 0,
  });

  const [totalLandingPage, setTotalLandingPage] = useState<any>([]);

  const [conversionData, setConversionData] = useState({
    addToCartPercentage: 0,
    purchasePercentage: 0,
  });

  useEffect(() => {
    const paramStartDate = dateFormate(startDate.toISOString(), "iso");
    const paramEndDate = dateFormate(
      endDate ? endDate.toISOString() : new Date(),
      "iso"
    );

    const payloadOBJ = {
      startDate: paramStartDate,
      endDate: paramEndDate,
    };

    const promises = [
      getTopProducts(payloadOBJ),
      getSalesHistory(payloadOBJ),
      getTotalOrder(payloadOBJ),
      getConversionRate(payloadOBJ),
      getTopLandingPage(payloadOBJ),
      getAvgSalesHistory(payloadOBJ),
    ];

    if (startDate && endDate) {
      Promise.allSettled(promises)
        .catch((err) => ToastService.error(err.message))
        .finally(() => {
          skeltonLoader(setAllContentLoader);
        });
      setMenu(false);
    }
  }, [startDate, endDate]);

  const getTopProducts = (payloadOBJ) => {
    AnalyticsService.topProducts(payloadOBJ)
      .then((res) => setProducts(res?.body?.DETAIL))
      .catch((err) => ToastService.error(err.message));
  };

  const getSalesHistory = (payloadOBJ) => {
    AnalyticsService.salesHistory(payloadOBJ)
      .then((res) => {
        if (res.body.DETAIL) {
          // const sales = modData(res.body.DETAIL, {
          //   date: "fdate",
          //   value: "amount",
          // });

          const sales = res.body.DETAIL.map((item) => ({
            date: item.gdate,
            value: item.amount,
          }));

          console.log(sales, res.body.DETAIL);

          const avgOrder = modData(res.body.DETAIL, {
            date: "gdate",
            value: "cnt",
          });
          setTotalSales(sales);
          setAvgOrderValue(avgOrder);
        }
        const head = res.body.HEAD;

        setAnalyticsData((prev) => ({
          ...prev,
          totalSales: Math.round(head.amount) || 0,
          totalUniqueOrders: Math.round(head.cnt) || 0,
        }));
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => {});
  };

  const getTotalOrder = (payloadOBJ) => {
    AnalyticsService.totalOrder(payloadOBJ)
      .then((res) => {
        const total = modData(res?.body?.DETAIL, {
          date: "created_on",
          value: "sub_total",
        });
        setTotalOrder(total);
        setAnalyticsData((prev) => ({
          ...prev,
          totalOrders: res?.body?.HEAD?.totalorder || 0,
        }));
      })
      .catch((err) => ToastService.error(err.message));
  };

  const getConversionRate = (payloadOBJ) => {
    AnalyticsService.conversionRate(payloadOBJ)
      .then((res) => {
        const data = res?.body?.HEAD;
        const siteVisit = data?.totaluniquevisit;
        const order = data?.totalorder;

        const addToCart = data?.cartnotordered + data?.orderfromcart;

        const addToCartPercentage = ((addToCart / siteVisit) * 100).toFixed(2);

        const purchasePercentage = ((order / siteVisit) * 100).toFixed(2);

        setConversionData({
          addToCartPercentage: Number(addToCartPercentage),
          purchasePercentage: Number(purchasePercentage),
        });
      })
      .catch((err) => ToastService.error(err.message));
  };

  const getTopLandingPage = (payloadOBJ) => {
    AnalyticsService.topLandingPages(payloadOBJ)
      .then((res) => setTotalLandingPage(res?.body?.DETAIL))
      .catch((err) => ToastService.error(err.message));
  };

  const getAvgSalesHistory = (payloadOBJ) => {
    AnalyticsService.avgSalesHistory(payloadOBJ)
      .then((res) => {
        const avg = modData(res.body.DETAIL, {
          date: "fdate",
          value: "amount",
        });

        const head = res.body.HEAD;

        setAnalyticsData((prev) => ({
          ...prev,
          averageOrderValue: Math.round(head.amount) || 0,
        }));
        setAvgSalesHistoryData(avg);
      })
      .catch((err) => ToastService.error(err.message));
  };

  const modData = (
    data: any,
    { date, value }: { date: string; value: string }
  ) => {
    const modOBJ = data.map((item: any) => {
      return {
        date: new Date(item[date]).toDateString(),
        value: item[value],
      };
    });

    let counts = modOBJ.reduce((prev, curr) => {
      let count = prev.get(curr.date) || 0;
      prev.set(curr.date, curr.value + count);
      return prev;
    }, new Map());

    // then, map your counts object back to an array
    let reducedObjArr = [...counts].map(([date, value]) => {
      return { date: Number(new Date(date)), value };
    });

    return reducedObjArr;
  };

  return (
    <div className="container p-0">
      <div className="w-100 row">
        <div className="d-flex justify-content-between">
          <h4 className="m-0 text_h4 text_medium">Analytics</h4>
          <div className="col-lg-2 col-md-2 col-sm-5">
            <TextInput
              onClick={() => setMenu(!menu)}
              className="wx__analytics-date"
              key={dateCompare(startDate, endDate)}
              defaultValue={dateCompare(startDate, endDate)}
              type="button"
            />

            <WxDropdown
              id="triggerPlace"
              isOpen={menu}
              setIsOpen={setMenu}
              backdrop
              drop={false}
            >
              <div className="d-flex">
                <div className="wx__date_action_list">
                  <ul style={{ width: "500px" }}>
                    <li
                      className="date_action_li"
                      onClick={() => {
                        setValueFor("today");
                        setDateRange([new Date(), new Date()]);
                      }}
                    >
                      <span className="text_body">Today</span>
                    </li>
                    <li
                      className="date_action_li"
                      onClick={() => {
                        setValueFor("yesterday");
                        setDateRange([
                          dateAction(1, "day"),
                          dateAction(1, "day"),
                        ]);
                      }}
                    >
                      <span className="text_body">Yesterday</span>
                    </li>
                    <li
                      className="date_action_li"
                      onClick={() => {
                        setValueFor("week");
                        setDateRange([dateAction(7, "day"), new Date()]);
                      }}
                    >
                      <span className="text_body">This Week</span>
                    </li>
                    <li
                      className="date_action_li"
                      onClick={() => {
                        setValueFor("month");
                        setDateRange([dateAction(1, "month"), new Date()]);
                      }}
                    >
                      <span className="text_body">This Month</span>
                    </li>
                    <div className="w-100 mt-2">
                      <DateInput
                        startDate={startDate}
                        endDate={endDate}
                        setDate={(val) => {
                          setDateRange(val);
                        }}
                        placeholder="DD / MM / YYYY"
                        selectsRange={true}
                        maxDate={new Date()}
                        inline
                      />
                    </div>
                  </ul>
                </div>
              </div>
            </WxDropdown>
          </div>
        </div>
      </div>
      <div className="row wx__g-3 mb-3">
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 wx__total_sales">
          <div className="bg-white rounded h-100">
            {!allContentLoader ? (
              <>
                <div className="total_sales_info d-flex justify-content-between align-items-center p-3">
                  <div>
                    <h6 className="m-0 text_h6 text_regular">
                      Total Sales
                    </h6>
                    <h3 className="m-0 text_h3 text_semibold">
                      {formateNumber(analyticsData.totalSales)} BDT
                    </h3>
                  </div>
                  <div>
                    <Icon icon="connected_tv" className="total_sales_icon" />
                  </div>
                </div>
                <WxHr />
              </>
            ) : (
              <ChartBoxHeader viewBox="0 0 550 135" />
            )}
            <div className="total_sales_chart ">
              {/* {!allContentLoader ? (
                <D3Chart initialData={totalSales} />
              ) : (
                <Preloader className="mt-5" />
              )} */}
              {
                <Suspense fallback={<Preloader className="mt-5" />}>
                  <D3Chart
                    initialData={totalSales}
                    defaultColor="#ff206e"
                    gradientColor={{
                      startColor: "#f20089",
                      endColor: "#d100d1",
                    }}
                    chartFor={valueFor}
                  />
                </Suspense>
              }
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 wx__online_session">
          <div className="bg-white rounded h-100">
            {!allContentLoader ? (
              <>
                <div className="online_session_info d-flex justify-content-between align-items-center p-3">
                  <div>
                    <h6 className="m-0 text_h6 text_regular">
                      Total Unique Orders
                    </h6>
                    <h3 className="m-0 text_h3 text_semibold">
                      {analyticsData.totalUniqueOrders}
                    </h3>
                  </div>
                  <div>
                    <Icon
                      className="online_session_icon"
                      icon="connected_tv"
                    />
                  </div>
                </div>
                <WxHr />
              </>
            ) : (
              <ChartBoxHeader viewBox="0 0 550 135" />
            )}
            <div className="">
              {!allContentLoader ? (
                <D3Chart
                  defaultColor="#0065DB"
                  gradientColor={{ startColor: "#0065DB", endColor: "#4cc9f0" }}
                  initialData={avgOrderValue}
                  chartFor={valueFor}
                />
              ) : (
                <Preloader className="mt-5" />
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
          <div className="bg-white rounded h-100 wx__total_orders">
            {!allContentLoader ? (
              <>
                <div className="online_session_info d-flex justify-content-between align-items-center p-3">
                  <div>
                    <h6 className="m-0 text_h6 text_regular">
                      Total Orders
                    </h6>
                    <h3 className="m-0 text_h3 text_semibold">
                      {analyticsData.totalOrders}
                    </h3>
                  </div>
                  <div>
                    <Icon className="total_orders_icon" icon="connected_tv" />
                  </div>
                </div>
                <WxHr />
              </>
            ) : (
              <ChartBoxHeader viewBox="0 0 550 135" />
            )}
            <div className="">
              {!allContentLoader ? (
                // <D3Chart
                //   lineColor="#1E6D00"
                //   areaColor="#A8D8A4"
                //   initialData={totalOrder}
                // />

                <D3Chart
                  initialData={totalOrder}
                  defaultColor="#1E6D00"
                  gradientColor={{ startColor: "green", endColor: "#eeef20" }}
                  chartFor={valueFor}
                />
              ) : (
                <Preloader className="mt-5" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row wx__g-3 mb-3">
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 wx__total_sales">
          <div className="bg-white rounded h-100 wx__avg_order_value">
            {!allContentLoader ? (
              <>
                <div className="total_sales_info d-flex justify-content-between align-items-center p-3">
                  <div>
                    <h6 className="m-0 text_h6 text_regular">
                      Average Order Value
                    </h6>
                    <h3 className="m-0 text_h3 text_semibold">
                      {formateNumber(analyticsData.averageOrderValue)} BDT
                    </h3>
                  </div>
                  <div>
                    <Icon icon="connected_tv" className="avg_order_icon" />
                  </div>
                </div>
                <WxHr />
              </>
            ) : (
              <ChartBoxHeader viewBox="0 0 550 135" />
            )}

            <div className="total_sales_chart ">
              {!allContentLoader ? (
                <D3Chart
                  defaultColor="#ff7b00"
                  initialData={avgSalesHistoryData}
                  gradientColor={{ startColor: "#ffd60a", endColor: "#ffbe0b" }}
                  chartFor={valueFor}
                />
              ) : (
                <Preloader className="mt-5" />
              )}
            </div>
          </div>
        </div>
        {/* <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 wx__online_session">
            <div className="bg-white rounded h-100 wx__avg_order_count">
              <div className="online_session_info d-flex justify-content-between align-items-center p-3">
                <div>
                  <h6 className="m-0 text_h6 text_regular">
                    Average Order Count
                  </h6>
                  <h3 className="m-0 text_h3 text_semibold">0</h3>
                </div>
                <div>
                  <Icon className="avg_count_icon" icon="connected_tv" />
                </div>
              </div>
              <WxHr />
              <div className="p-3">
                <D3Chart
                  lineColor="#36CFC9"
                  areaColor="#B5F5EC"
                  initialData={onlineSessionData}
                />
              </div>
            </div>
          </div> */}
        <div className="wx__online-conversion-rate col-xl-4 col-lg-12 col-md-12 col-sm-12">
          {!allContentLoader ? (
            <div className="bg-white rounded h-100 p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="m-0 text_h6 text_regular">
                    Online Store Conversion Rate
                  </h6>
                  <h3 className="m-0 text_h3 text_semibold">
                    {conversionData?.purchasePercentage || 0}%
                  </h3>
                </div>
                <div>
                  <Icon
                    className="onlinestore_conversion_icon"
                    icon="social_distance"
                  />
                </div>
              </div>
              <WxHr />
              <div>
                <span className="text_caption">conversion funnel</span>
                <div className="d-flex justify-content-between align-items-center my-3">
                  <div>
                    <p className="m-0 text_body">Add to Cart</p>
                    <h4 className="m-0 text_h4 text_medium">
                      {conversionData?.addToCartPercentage || 0}%
                    </h4>
                    {/* <span className="text_small">(0 sessions)</span> */}
                  </div>
                  <div>{/* <FunnelChart /> */}</div>
                </div>
                <WxHr />
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="m-0 text_body">Purchase</p>
                    <h4 className="m-0 text_h4 text_medium">
                      {conversionData?.purchasePercentage || 0}%
                    </h4>
                    {/* <span className="text_small">(0 sessions)</span> */}
                  </div>
                  {/* <div>chart</div> */}
                  {/* <FunnelChart /> */}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded">
              <ConversionRate viewBox="0 0 550 436" />
            </div>
          )}
        </div>
        {/* temporary here */}
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 wx__top_landing_page">
          <div className="bg-white p-3 rounded h-100 overflow-hidden">
            {!allContentLoader ? (
              <>
                <h6 className="m-0 text_h6 text_regular">
                  Top landing pages by sessions
                </h6>
                <div className="landing_page_list">
                  <ul>
                    {totalLandingPage.length ? (
                      totalLandingPage?.map((landing: any, index) => {
                        return (
                          <li key={index}>
                            <a target="blank" href={landing?.reference_link}>
                              {landing?.reference_link}
                            </a>
                            <span>{landing?.totaluniquevisit}</span>
                          </li>
                        );
                      })
                    ) : (
                      <h3 className="text-danger">Not Found</h3>
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <SessionLandingSkelton viewBox="0 0 550 436" />
            )}
          </div>
        </div>
        {/* end */}
      </div>
      <div className="row wx__g-3 mb-3">
        {/* <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 wx__top_products">
            <div className="bg-white p-3 rounded h-100">
              <h6 className="m-0">Top Products</h6>
              <div className="top_products_list">
                <ul>
                  {products.length ? (
                    products?.map((pd: any) => {
                      return (
                        <li key={pd?.id}>
                          <div className="product_img">
                            <img
                              src={imageURLGenerate(pd?.thumbnail) || topsImg}
                              alt=""
                            />
                          </div>
                          <div>
                            <p className="m-0 text_body text_strong">
                              {pd?.title}
                            </p>
                            <br />
                            <span className="text_subtitle">
                              {pd?.quantity} sold
                            </span>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <h3 className="text-danger">Not Found</h3>
                  )}
                </ul>
              </div>
            </div>
          </div> */}
        {/* top landing pages by sessions */}
        {/* <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 wx__top_landing_page">
            <div className="bg-white p-3 rounded h-100">
              <h6 className="m-0">Top landing pages by sessions</h6>
              <div className="landing_page_list">
                <ul>
                  {totalLandingPage.length ? (
                    totalLandingPage?.map((landing: any, index) => {
                      return (
                        <li key={index}>
                          <a target="blank" href={landing?.reference_link}>
                            {landing?.reference_link}
                          </a>
                          <span>{landing?.totaluniquevisit}</span>
                        </li>
                      );
                    })
                  ) : (
                    <h3 className="text-danger">Not Found</h3>
                  )}
                </ul>
              </div>
            </div>
          </div> */}
        {/* end */}
      </div>
      {/* <div className="row wx__g-3">
          <div className="col-lg-8 col-sm-12">
            <div className="overflow-hidden rounded w-100 h-100 border">
              <VerticalTab>
                <VerticalTab.Tablist activeTab={3} className="tablist">
                  <VerticalTab.Tab id={2}>
                    <h6 className="m-0 text_h6 text_regular">
                      Avg Quantity Per Order
                    </h6>
                    <h3 className="m-0 text_h3 text_semibold">
                      34
                    </h3>
                  </VerticalTab.Tab>
                  <VerticalTab.Tab id={3}>
                    <h6 className="m-0 text_h6 text_regular">
                      Total Orders
                    </h6>
                    <h3 className="m-0 text_h3 text_semibold">
                      45
                    </h3>
                  </VerticalTab.Tab>
                  <VerticalTab.Tab id={3}>
                    <h6 className="m-0 text_h6 text_regular">
                      Total Orders
                    </h6>
                    <h3 className="m-0 text_h3 text_semibold">0</h3>
                  </VerticalTab.Tab>
                </VerticalTab.Tablist>
                <VerticalTab.ContentItems>
                  <VerticalTab.Content>This is Div2</VerticalTab.Content>
                  <VerticalTab.Content>This is Div3</VerticalTab.Content>
                  <VerticalTab.Content id={3}>
                    <D3Chart
                      lineColor="#1E6D00"
                      areaColor="#A8D8A4"
                      initialData={avgOrderValue}
                    />
                  </VerticalTab.Content>
                </VerticalTab.ContentItems>
              </VerticalTab>
            </div>
          </div>
          <div className="col-lg-4 col-sm-12 wx__top_products">
            <div className="bg-white p-3 rounded h-100">
              <h6 className="m-0">Top Products</h6>
              <div className="top_products_list">
                <ul>
                  {products.length ? (
                    products?.map((pd: any) => {
                      return (
                        <li key={pd.id}>
                          <div className="product_img">
                            <img src={topsImg} alt="" />
                          </div>
                          <div>
                            <p className="m-0 text_body text_strong">
                              {pd.title}
                            </p>
                            <br />
                            <span className="text_subtitle">
                              {pd.quantity} sold
                            </span>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <h3 className="text-danger">Not Found</h3>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div> */}
    </div>
  );
};

export default Analytics;
