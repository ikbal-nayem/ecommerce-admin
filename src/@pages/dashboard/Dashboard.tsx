import DateInput from "@components/DatePicker/DateInput";
import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxButton from "@components/WxButton";
import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import DashboardAppSkelton from "@components/WxSkelton/Dashboard/DashboardAppSkelton";
import NotifyListSkelton from "@components/WxSkelton/Dashboard/NotifyListSkelton";
import SummerySkelton from "@components/WxSkelton/Dashboard/SummerySkelton";
import VerticalTabSkelton from "@components/WxSkelton/Dashboard/VerticalTabSkelton";
import { MASTER_META_KEY } from "config/constants";
import { ENV } from "config/ENV.config";
import { ORDER } from "routes/path-name.route";
import { AppsService } from "services/api/Apps.service";
import { DashboardService } from "services/api/Dashboard.service";
import { LocalStorageService } from "services/utils/local-storage.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import skeltonLoader from "utils/skeltonLoader";
import { dateFormate } from "utils/splitDate";
import { dateAction, dateCompare, formateNumber } from "utils/utils";
import bannerImg from "../../assets/images/banner.jpeg";
import storeFront from "../../assets/images/storefront.png";
import DashboardApp from "./components/DashboardApp/DashboardApp";
import DashboardTask from "./components/DashboardTask/DashboardTask";
import "./Dashboard.scss";

const titleList = {
  isAccountVerified: "Verify Account",
  hasProduct: "Add first Product",
  hasLogo: "Add Your Logo",
  hasSlider: "Add Website Banner",
};

const Dashboard = () => {
  const [staticContent, setStaticContent] = useState<any>({});
  const [orderSummery, setOrderSummery] = useState<any>({});
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [menu, setMenu] = useState(false);

  const [summeryLoader, setSummeryLoader] = useState<boolean>(true);
  const [appsLoader, setAppsLoader] = useState<boolean>(true);

  const [otpModal, setOtpModal] = useState(false);
  const [apps, setApps] = useState<any[]>([]);
  const [task, setTask] = useState<number>(0);
  const [tabs, setTabs] = useState<any>([]);
  const [taskNotVisible, setTaskNotVisible] = useState<any>(
    LocalStorageService.get("taskNotVisible")
  );
  const [showStoreInfo, setShowStoreInfo] = useState<boolean>(true);

  let { user_data, activePlan } = useSelector((data: any) => data.user);

  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (LocalStorageService.get("l_c_flag") + "" === "false")
      setShowStoreInfo(false);
    // const stickyDiv = document.getElementById("sticky__sec");
    // const handleScroll = () => {
    // 	if (window.scrollY >= 31) stickyDiv.classList.add("sticky-top");
    // 	else stickyDiv.classList.remove("sticky-top");
    // };
    // window.addEventListener("scroll", handleScroll);
    // return () => {
    // 	window.removeEventListener("scroll", handleScroll);
    // };
  }, []);
  useEffect(() => {
    getStaticContent();
  }, [otpModal]);

  useEffect(() => {
    if (startDate && endDate) {
      getOrderSummery();
      setMenu(false);
    }
  }, [startDate, endDate]);

  const getStaticContent = () => {
    DashboardService.getStaticContent()
      .then((res: any) => {
        setStaticContent(res.body);
        const todo = res.body.todo;
        if (todo) {
          // creating an Array
          const tabList = Object.keys(todo).map((item) => ({
            [item]: todo[item],
            title: titleList[item] ? titleList[item] : "No Title",
            active: todo[item] === "YES" ? false : true,
          }));

          LocalStorageService.set("todo", tabList);
          setTabs(tabList);
          setTask(tabList.filter((item) => !item.active).length || 0);
        }
      })
      .catch((err: any) => ToastService.error(err))
      .finally(() => {
        skeltonLoader(setIsLoader);
      });
  };

  const getOrderSummery = () => {
    DashboardService.orderSummery({
      from: dateFormate(new Date(startDate).toISOString(), "iso"),
      to: dateFormate(new Date(endDate || new Date()).toISOString(), "iso"),
    })
      .then((res: any) => {
        setOrderSummery(res.body);
      })
      .catch((err: any) => ToastService.error(err))
      .finally(() => {
        skeltonLoader(setSummeryLoader);
      });
  };

  useEffect(() => {
    getRecommendedApps();
  }, []);

  const setShowStoreInfoFun = () => {
    LocalStorageService.set("l_c_flag", "false");
    setShowStoreInfo(false);
  };

  const getRecommendedApps = () => {
    AppsService.get({ body: { packageLevel: activePlan?.level } })
      .then((res) => setApps(res.body))
      .catch((err) => ToastService.error(err.message))
      .finally(() => {
        skeltonLoader(setAppsLoader);
      });
  };

  return (
    <WxMainLg className="wx__dashboard">
      {/* <div className="wx__mt-2 wx__mb-3">
				<h4 title="hello mb-0">Dashboard</h4>
			</div> */}

      <div
        id="sticky__sec"
        className={showStoreInfo ? "store-info show-sec" : "store-info"}
      >
        <div className="wx__d-flex wx__align-items-center">
          <img src={storeFront} />
          {/* <Link
						to=""
						
					> */}
          <h3
            className="wx__mb-0 wx__ms-2 wx__f-lora"
            onClick={() => window.open(ENV.STORE_DOMAIN, "_blank")}
          >
            {user_data?.store_name || "WebX Global"}
          </h3>
          {/* </Link> */}
        </div>
        <div className="right-sec">
          <a href={ENV.LandingPageURL + "learning-center"} target="_blank">
            <WxIcon icon="menu_book" className="hide-mobile-view-sm" />
            Learning Center
          </a>
          <WxIcon
            className="wx__ms-2"
            icon="close"
            role="button"
            onClick={() => setShowStoreInfoFun()}
          />
        </div>
      </div>

      {!taskNotVisible &&
        (!isLoader ? (
          task === 4 || (
            <div className="wx__task wx__mb-3">
              <div className="wx__task_details wx__d-flex wx__justify-content-between wx__align-items-center">
                <div>
                  <h4 className="wx__m-0 wx__text_h4 wx__text_semibold wx__f-lora">
                    Welcome to WebX
                  </h4>
                  <p className="wx__m-0 wx__text_body wx__text_regular">
                    Lets complete the tasks to get started
                  </p>
                </div>
                <div className="wx__d-flex  wx__align-items-center">
                  <div className="task_progress">
                    <WxIcon
                      className="progress_icon"
                      icon="panorama_fish_eye"
                    />
                    <span className="wx__text_body wx__text_regular wx__ms-2">
                      {task}/4 tasks completed
                    </span>
                  </div>
                  <WxIcon
                    onClick={() => {
                      LocalStorageService.set("taskNotVisible", true);
                      setTaskNotVisible(true);
                    }}
                    className="task_close_icon"
                    icon="close"
                  />
                </div>
              </div>
              <DashboardTask
                // handleSendOTP={handleSendOTP}
                content={tabs}
                otpModal={otpModal}
                setOtpModal={setOtpModal}
              />
            </div>
          )
        ) : (
          <div className="wx__bg-white wx__rounded  wx__mt-">
            <VerticalTabSkelton viewBox="0 0 588 252" />
          </div>
        ))}
      {!summeryLoader ? (
        <div className="wx__row dashboard_summery">
          <div className="wx__col-md-9">
            <div className="wx__card wx__p-3">
              <div className="wx__row position-relative">
                <div className="wx__col-lg-4 wx__col-md-4 wx__col-sm-5">
                  <WxInput
                    onClick={() => setMenu(!menu)}
                    className="wx__data_input"
                    label="Select Date Range"
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
                    <div className="wx__d-flex">
                      <div className="wx__date_action_list">
                        <ul>
                          <li
                            className="date_action_li"
                            onClick={() =>
                              setDateRange([new Date(), new Date()])
                            }
                          >
                            <span className="wx__text_body">Today</span>
                          </li>
                          <li
                            className="date_action_li"
                            onClick={() =>
                              setDateRange([
                                dateAction(1, "day"),
                                dateAction(1, "day"),
                              ])
                            }
                          >
                            <span className="wx__text_body">Yesterday</span>
                          </li>
                          <li
                            className="date_action_li"
                            onClick={() =>
                              setDateRange([dateAction(7, "day"), endDate])
                            }
                          >
                            <span className="wx__text_body">This Week</span>
                          </li>
                          <li
                            className="date_action_li"
                            onClick={() =>
                              setDateRange([dateAction(1, "month"), endDate])
                            }
                          >
                            <span className="wx__text_body">This Month</span>
                          </li>
                          <div className="wx__w-100 mt-2">
                            <DateInput
                              startDate={startDate}
                              endDate={endDate}
                              setDate={(val) => setDateRange(val)}
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
              <div className="wx__row">
                <div className="wx__col-md-4 wx__col-sm-12 orders_summery">
                  <WxIcon className="orders_icon" icon="receipt" />
                  <div>
                    <span className="wx__text_caption">Total Orders</span>
                    <h5 className="wx__text_h5 wx__m-0 wx__text_medium">
                      {formateNumber(orderSummery?.totalOrder) || 0}
                    </h5>
                  </div>
                </div>
                <div className="wx__col-md-4 wx__col-sm-12 sales_summery">
                  <WxIcon className="sales_icon" icon="currency_yen" />
                  <div>
                    <span className="wx__text_caption">Total Sales</span>
                    <h5 className="wx__text_h5 wx__m-0 wx__text_medium">
                      BDT {formateNumber(orderSummery?.totalSaleAmount) || 0}
                    </h5>
                  </div>
                </div>
                <div className="wx__col-md-4 wx__col-sm-12 visitors_summery">
                  <WxIcon className="visitors_icon" icon="supervisor_account" />
                  <div>
                    <span className="wx__text_caption">Total Visitors</span>
                    <h5 className="wx__text_h5 wx__m-0 wx__text_medium">
                      {formateNumber(orderSummery?.totalUniqueVisit) || 0}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="wx__col-md-3">
            <div className="wx__card_ wx__p-3 wx__d-flex wx__flex-column wx__justify-content-between">
              <div className="top wx__d-flex wx__align-items-center wx__mb-3">
                <span className="circle"></span>
                <h6 className="wx__text_medium wx__mb-0">Live</h6>
              </div>
              <div className="bottom">
                <p className="wx__text_caption">Total visitors now</p>
                <h2 className="wx__mb-0">0</h2>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="wx__bg-white wx__rounded  wx__mt-3">
          <SummerySkelton viewBox="0 0 590 115" />
        </div>
      )}
      <div className="wx__row">
        <div className="wx__mt-3">
          {!summeryLoader ? (
            <div className="wx__card wx__p-3 notify_list">
              <div className="notify wx__d-flex wx__justify-content-between wx__align-items-center">
                <div className="wx__d-flex wx__align-items-center left">
                  <WxIcon className="wx__me-2" icon="receipt" />
                  <p className="wx__m-0">
                    <span className="wx__text_semibold">
                      {orderSummery?.totalPendingOrder} orders
                    </span>{" "}
                    to pending
                  </p>
                </div>
                <div>
                  <WxButton
                    size="sm"
                    color="secondary"
                    onClick={() => {
                      navigate(
                        ORDER +
                          "?orderStatus=" +
                          MASTER_META_KEY.ORDER_STATUS_TYPE_PENDING
                      );
                    }}
                  >
                    View More{" "}
                    <WxIcon className="wx__ms-2" icon="arrow_forward" />
                  </WxButton>
                </div>
              </div>
              <div className="notify wx__d-flex wx__justify-content-between wx__align-items-center">
                <div className="wx__d-flex wx__align-items-center left">
                  <WxIcon className="wx__me-2" icon="account_balance_wallet" />
                  <p className="wx__m-0">
                    <span className="wx__text_semibold">
                      {orderSummery?.totalUnpaidOrder} payments
                    </span>{" "}
                    to unpaid
                  </p>
                </div>
                <div>
                  <WxButton
                    size="sm"
                    color="secondary"
                    onClick={() => {
                      navigate("/settings/payment");
                    }}
                  >
                    View More{" "}
                    <WxIcon className="wx__ms-2" icon="arrow_forward" />
                  </WxButton>
                </div>
              </div>
              <div className=" notify wx__d-flex wx__justify-content-between wx__align-items-center">
                <div className="wx__d-flex wx__align-items-center left">
                  <WxIcon
                    className="wx__me-2"
                    icon="production_quantity_limits"
                  />
                  <p className="wx__m-0">
                    <span className="wx__text_semibold">
                      {orderSummery?.totalRefundRequest} Refunds
                    </span>{" "}
                    request pending
                  </p>
                </div>
                <div>
                  <WxButton
                    size="sm"
                    color="secondary"
                    onClick={() => {
                      navigate(
                        ORDER +
                          "?paymentStatus=" +
                          MASTER_META_KEY.PAYMENT_STATUS_TYPE_REFUNDED
                      );
                    }}
                  >
                    View More{" "}
                    <WxIcon className="wx__ms-2" icon="arrow_forward" />
                  </WxButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="wx__bg-white wx__rounded  wx__mt-3">
              <NotifyListSkelton viewBox="0 0 590 115" />
            </div>
          )}
        </div>
      </div>
      {/* {!summeryLoader ? (
        <div className="wx__all_packBanner wx__d-flex wx__justify-content-between wx__align-items-center">
          <h2 className="wx__m-0">50% off on all packs</h2>
          <WxButton variant="outline">
            Explore Now
            <WxIcon className="wx__ms-2" icon="arrow_forward" />
          </WxButton>
        </div>
      ) : (
        <div className="wx__bg-white wx__rounded wx__mt-3">
          <AllPackBanner viewBox="0 0 590 60" />
        </div>
      )} */}

      {/* <div className="wx__discover_webx wx__card wx__p-3 wx__pb-0 wx__mt-3">
				<div className="wx__d-flex wx__justify-content-between wx__align-items-center wx__mb-4">
					<h5 className="wx__m-0 wx__text_h5 wx__text_semibold">
						Discover Webx
					</h5>
					<div className="wx__d-flex wx__align-items-center">
						<WxButton size="sm">Explore More</WxButton>
						<WxIcon className="wx__ms-3" icon="more_vert" />
					</div>
				</div>
				<div className="wx__row">
					{staticContent?.tutorials?.map((item: any) => {
						return (
							<div
								key={item.id}
								className="wx__discover_cart wx__col-md-4 wx__col-sm-12 wx__mb-3"
							>
								<iframe
									src={`https://www.youtube.com/embed/${getId(item.videoLink)}`}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>

								<span className="wx__text_medium wx__text__body wx__mt-3">
									{sliceParagraph(item?.description, 15)}
								</span>
							</div>
						);
					})}
				</div>
			</div> */}
      {!appsLoader ? (
        <div className="wx__apps_of_the_week">
          <div className="wx__d-flex wx__justify-content-between wx__align-items-center">
            <div className="wx__d-flex wx__align-items-center">
              <WxIcon className="trophy_icon" size={28} icon="emoji_events" />
              <div className="wx__ms-2">
                <h5 className="wx__m-0 wx__text_h5 wx__text_semibold">
                  Apps Of The Week
                </h5>
                <span className="wx__text_body wx__text_regular">
                  Explore the endless possibilities with the help of our apps
                </span>
              </div>
            </div>
            <WxIcon icon="more_vert" />
          </div>
          <div className="wx__row">
            <DashboardApp apps={apps} />
            <div
              onClick={() => navigate("/apps/list")}
              style={{ cursor: "pointer" }}
              className="wx__col-md-3 wx__col-sm-12 wx__mt-3"
            >
              <div className="wx__exploreMore_card wx__card ">
                <h2 className="wx__m-0">
                  <span>Explore More</span>
                  <WxIcon
                    className="explore_more_icon wx__ms-3"
                    icon="arrow_circle_right"
                  />
                </h2>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="wx__bg-white wx__rounded wx__mt-3">
          <DashboardAppSkelton viewBox="0 0 595 205" />
        </div>
      )}
      <div className="wx__wordpress_seo wx__rounded">
        <img src={bannerImg} alt="" />
      </div>

      {/* <div className="wx__blog wx__row wx__mt-3">
        <div className="wx__card wx__p-3">
          <div className="wx__d-flex wx__justify-content-between wx__align-items-center">
            <h5 className="wx__m-0 wx__text_h5 wx__text_semibold">Blog</h5>
            <div className="wx__d-flex wx__align-items-center">
              <WxButton size="sm">Explore More</WxButton>
              <WxIcon className="wx__ms-3" icon="more_vert" />
            </div>
          </div>
          <div className="wx__row">
            {[1, 2, 3].map((item: any) => {
              return <DashboardBlog key={item} />;
            })}
          </div>
        </div>
      </div> */}

      <div className="wx__blog "></div>
    </WxMainLg>
  );
};
export default Dashboard;
