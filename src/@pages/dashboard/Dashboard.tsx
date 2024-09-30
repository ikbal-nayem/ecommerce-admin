import DateInput from '@components/DatePicker/DateInput';
import WxMainLg from '@components/MainContentLayout/WxMainLg';
import WxButton from '@components/WxButton';
import WxDropdown from '@components/WxDropdown/WxDropdown';
import WxIcon from '@components/WxIcon/WxIcon';
import WxInput from '@components/WxInput';
import NotifyListSkelton from '@components/WxSkelton/Dashboard/NotifyListSkelton';
import SummerySkelton from '@components/WxSkelton/Dashboard/SummerySkelton';
import { MASTER_META_KEY } from 'config/constants';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ORDER } from 'routes/path-name.route';
import { DashboardService } from 'services/api/Dashboard.service';
import { ToastService } from 'services/utils/toastr.service';
import skeltonLoader from 'utils/skeltonLoader';
import { dateFormate } from 'utils/splitDate';
import { dateAction, dateCompare, formateNumber } from 'utils/utils';
import './Dashboard.scss';

const Dashboard = () => {
	const [orderSummery, setOrderSummery] = useState<any>({});
	const [menu, setMenu] = useState(false);
	const [summeryLoader, setSummeryLoader] = useState<boolean>(true);
	const [dateRange, setDateRange] = useState([new Date(), new Date()]);

	const navigate = useNavigate();

	const [startDate, endDate] = dateRange;

	useEffect(() => {
		if (startDate && endDate) {
			getOrderSummery();
			setMenu(false);
		}
	}, [startDate, endDate]);

	const getOrderSummery = () => {
		DashboardService.orderSummery({
			from: dateFormate(new Date(startDate).toISOString(), 'iso'),
			to: dateFormate(new Date(endDate || new Date()).toISOString(), 'iso'),
		})
			.then((res: any) => {
				setOrderSummery(res.body);
			})
			.catch((err: any) => ToastService.error(err))
			.finally(() => {
				skeltonLoader(setSummeryLoader);
			});
	};

	return (
		<WxMainLg className='wx__dashboard'>
			{!summeryLoader ? (
				<div className='row dashboard_summery g-3'>
					<div className='col-md-9'>
						<div className='card p-3'>
							<div className='row position-relative'>
								<div className='col-lg-4 col-md-4 col-sm-5'>
									<WxInput
										onClick={() => setMenu(!menu)}
										className='wx__data_input'
										label='Select Date Range'
										key={dateCompare(startDate, endDate)}
										defaultValue={dateCompare(startDate, endDate)}
										type='button'
									/>

									<WxDropdown id='triggerPlace' isOpen={menu} setIsOpen={setMenu} backdrop drop={false}>
										<div className='d-flex'>
											<div className='wx__date_action_list'>
												<ul>
													<li
														className='date_action_li'
														onClick={() => setDateRange([new Date(), new Date()])}
													>
														<span className='wx__text_body'>Today</span>
													</li>
													<li
														className='date_action_li'
														onClick={() => setDateRange([dateAction(1, 'day'), dateAction(1, 'day')])}
													>
														<span className='wx__text_body'>Yesterday</span>
													</li>
													<li
														className='date_action_li'
														onClick={() => setDateRange([dateAction(7, 'day'), endDate])}
													>
														<span className='wx__text_body'>This Week</span>
													</li>
													<li
														className='date_action_li'
														onClick={() => setDateRange([dateAction(1, 'month'), endDate])}
													>
														<span className='wx__text_body'>This Month</span>
													</li>
													<div className='wx__w-100 mt-2'>
														<DateInput
															startDate={startDate}
															endDate={endDate}
															setDate={(val) => setDateRange(val)}
															placeholder='DD / MM / YYYY'
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
							<div className='wx__row'>
								<div className='wx__col-md-4 wx__col-sm-12 orders_summery'>
									<WxIcon className='orders_icon' icon='receipt' />
									<div>
										<span className='wx__text_caption'>Total Orders</span>
										<h5 className='wx__text_h5 wx__m-0 wx__text_medium'>
											{formateNumber(orderSummery?.totalOrder) || 0}
										</h5>
									</div>
								</div>
								<div className='wx__col-md-4 wx__col-sm-12 sales_summery'>
									<WxIcon className='sales_icon' icon='currency_yen' />
									<div>
										<span className='wx__text_caption'>Total Sales</span>
										<h5 className='wx__text_h5 wx__m-0 wx__text_medium'>
											BDT {formateNumber(orderSummery?.totalSaleAmount) || 0}
										</h5>
									</div>
								</div>
								<div className='wx__col-md-4 wx__col-sm-12 visitors_summery'>
									<WxIcon className='visitors_icon' icon='supervisor_account' />
									<div>
										<span className='wx__text_caption'>Total Visitors</span>
										<h5 className='wx__text_h5 wx__m-0 wx__text_medium'>
											{formateNumber(orderSummery?.totalUniqueVisit) || 0}
										</h5>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='col-md-3'>
						<div className='wx__card_ p-3 d-flex flex-column justify-content-between'>
							<div className='top d-flex align-items-center mb-3'>
								<span className='circle'></span>
								<h6 className='wx__text_medium mb-0'>Live</h6>
							</div>
							<div className='bottom'>
								<p className='wx__text_caption'>Total visitors now</p>
								<h2 className='mb-0'>0</h2>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className='bg-white rounded  mt-3'>
					<SummerySkelton viewBox='0 0 590 115' />
				</div>
			)}
			<div className='row'>
				<div className='mt-3'>
					{!summeryLoader ? (
						<div className='card p-3 notify_list'>
							<div className='notify d-flex justify-content-between align-items-center'>
								<div className='d-flex align-items-center left'>
									<WxIcon className='me-2' icon='receipt' />
									<p className='m-0'>
										<span className='wx__text_semibold'>{orderSummery?.totalPendingOrder} orders</span> to
										pending
									</p>
								</div>
								<div>
									<WxButton
										size='sm'
										color='secondary'
										onClick={() => {
											navigate(ORDER + '?orderStatus=' + MASTER_META_KEY.ORDER_STATUS_TYPE_PENDING);
										}}
									>
										View More <WxIcon className='ms_2' icon='arrow_forward' />
									</WxButton>
								</div>
							</div>
							<div className='notify wx__d-flex wx__justify-content-between wx__align-items-center'>
								<div className='wx__d-flex wx__align-items-center left'>
									<WxIcon className='wx__me-2' icon='account_balance_wallet' />
									<p className='wx__m-0'>
										<span className='wx__text_semibold'>{orderSummery?.totalUnpaidOrder} payments</span> to
										unpaid
									</p>
								</div>
								<div>
									<WxButton
										size='sm'
										color='secondary'
										onClick={() => {
											navigate('/settings/payment');
										}}
									>
										View More <WxIcon className='ms_2' icon='arrow_forward' />
									</WxButton>
								</div>
							</div>
							<div className=' notify wx__d-flex wx__justify-content-between wx__align-items-center'>
								<div className='wx__d-flex wx__align-items-center left'>
									<WxIcon className='wx__me-2' icon='production_quantity_limits' />
									<p className='wx__m-0'>
										<span className='wx__text_semibold'>{orderSummery?.totalRefundRequest} Refunds</span>{' '}
										request pending
									</p>
								</div>
								<div>
									<WxButton
										size='sm'
										color='secondary'
										onClick={() => {
											navigate(ORDER + '?paymentStatus=' + MASTER_META_KEY.PAYMENT_STATUS_TYPE_REFUNDED);
										}}
									>
										View More <WxIcon className='ms_2' icon='arrow_forward' />
									</WxButton>
								</div>
							</div>
						</div>
					) : (
						<div className='wx__bg-white wx__rounded  wx__mt-3'>
							<NotifyListSkelton viewBox='0 0 590 115' />
						</div>
					)}
				</div>
			</div>
			{/* {!summeryLoader ? (
        <div className="wx__all_packBanner wx__d-flex wx__justify-content-between wx__align-items-center">
          <h2 className="wx__m-0">50% off on all packs</h2>
          <WxButton variant="outline">
            Explore Now
            <WxIcon className="ms_2" icon="arrow_forward" />
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
			{/* {!appsLoader ? (
				<div className='wx__apps_of_the_week'>
					<div className='wx__d-flex wx__justify-content-between wx__align-items-center'>
						<div className='wx__d-flex wx__align-items-center'>
							<WxIcon className='trophy_icon' size={28} icon='emoji_events' />
							<div className='ms_2'>
								<h5 className='wx__m-0 wx__text_h5 wx__text_semibold'>Apps Of The Week</h5>
								<span className='wx__text_body wx__text_regular'>
									Explore the endless possibilities with the help of our apps
								</span>
							</div>
						</div>
						<WxIcon icon='more_vert' />
					</div>
					<div className='wx__row'>
						<DashboardApp apps={apps} />
						<div
							onClick={() => navigate('/apps/list')}
							style={{ cursor: 'pointer' }}
							className='wx__col-md-3 wx__col-sm-12 wx__mt-3'
						>
							<div className='wx__exploreMore_card wx__card '>
								<h2 className='wx__m-0'>
									<span>Explore More</span>
									<WxIcon className='explore_more_icon wx__ms-3' icon='arrow_circle_right' />
								</h2>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className='wx__bg-white wx__rounded wx__mt-3'>
					<DashboardAppSkelton viewBox='0 0 595 205' />
				</div>
			)} */}
		</WxMainLg>
	);
};
export default Dashboard;
