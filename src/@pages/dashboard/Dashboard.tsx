import DateInput from '@components/DatePicker/DateInput';
import WxMainLg from '@components/MainContentLayout/MainLg';
import {Button} from '@components/Button';
import WxDropdown from '@components/WxDropdown/WxDropdown';
import Icon from '@components/Icon';
import TextInput from '@components/TextInput';
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
		<WxMainLg className='dashboard'>
			{!summeryLoader ? (
				<div className='row dashboard_summery g-3'>
					<div className='col-md-9'>
						<div className='card p-3'>
							<div className='row position-relative'>
								<div className='col-lg-4 col-md-4 col-sm-5'>
									<TextInput
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
														<span className='text_body'>Today</span>
													</li>
													<li
														className='date_action_li'
														onClick={() => setDateRange([dateAction(1, 'day'), dateAction(1, 'day')])}
													>
														<span className='text_body'>Yesterday</span>
													</li>
													<li
														className='date_action_li'
														onClick={() => setDateRange([dateAction(7, 'day'), endDate])}
													>
														<span className='text_body'>This Week</span>
													</li>
													<li
														className='date_action_li'
														onClick={() => setDateRange([dateAction(1, 'month'), endDate])}
													>
														<span className='text_body'>This Month</span>
													</li>
													<div className='w-100 mt-2'>
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
							<div className='row'>
								<div className='col-md-4 col-sm-12 orders_summery'>
									<Icon className='orders_icon' icon='receipt' />
									<div>
										<span className='text_caption'>Total Orders</span>
										<h5 className='text_h5 m-0 text_medium'>
											{formateNumber(orderSummery?.totalOrder) || 0}
										</h5>
									</div>
								</div>
								<div className='col-md-4 col-sm-12 sales_summery'>
									<Icon className='sales_icon' icon='currency_yen' />
									<div>
										<span className='text_caption'>Total Sales</span>
										<h5 className='text_h5 m-0 text_medium'>
											BDT {formateNumber(orderSummery?.totalSaleAmount) || 0}
										</h5>
									</div>
								</div>
								<div className='col-md-4 col-sm-12 visitors_summery'>
									<Icon className='visitors_icon' icon='supervisor_account' />
									<div>
										<span className='text_caption'>Total Visitors</span>
										<h5 className='text_h5 m-0 text_medium'>
											{formateNumber(orderSummery?.totalUniqueVisit) || 0}
										</h5>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='col-md-3'>
						<div className='card_ p-3 d-flex flex-column justify-content-between'>
							<div className='top d-flex align-items-center mb-3'>
								<span className='circle'></span>
								<h6 className='text_medium mb-0'>Live</h6>
							</div>
							<div className='bottom'>
								<p className='text_caption'>Total visitors now</p>
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
									<Icon className='me-2' icon='receipt' />
									<p className='m-0'>
										<span className='text_semibold'>{orderSummery?.totalPendingOrder} orders</span> to
										pending
									</p>
								</div>
								<div>
									<Button
										size='sm'
										color='secondary'
										onClick={() => {
											navigate(ORDER + '?orderStatus=' + MASTER_META_KEY.ORDER_STATUS_TYPE_PENDING);
										}}
									>
										View More <Icon className='ms_2' icon='arrow_forward' />
									</Button>
								</div>
							</div>
							<div className='notify d-flex justify-content-between align-items-center'>
								<div className='d-flex align-items-center left'>
									<Icon className='me-2' icon='account_balance_wallet' />
									<p className='m-0'>
										<span className='text_semibold'>{orderSummery?.totalUnpaidOrder} payments</span> to
										unpaid
									</p>
								</div>
								<div>
									<Button
										size='sm'
										color='secondary'
										onClick={() => {
											navigate('/settings/payment');
										}}
									>
										View More <Icon className='ms_2' icon='arrow_forward' />
									</Button>
								</div>
							</div>
							<div className=' notify d-flex justify-content-between align-items-center'>
								<div className='d-flex align-items-center left'>
									<Icon className='me-2' icon='production_quantity_limits' />
									<p className='m-0'>
										<span className='text_semibold'>{orderSummery?.totalRefundRequest} Refunds</span>{' '}
										request pending
									</p>
								</div>
								<div>
									<Button
										size='sm'
										color='secondary'
										onClick={() => {
											navigate(ORDER + '?paymentStatus=' + MASTER_META_KEY.PAYMENT_STATUS_TYPE_REFUNDED);
										}}
									>
										View More <Icon className='ms_2' icon='arrow_forward' />
									</Button>
								</div>
							</div>
						</div>
					) : (
						<div className='bg-white rounded  mt-3'>
							<NotifyListSkelton viewBox='0 0 590 115' />
						</div>
					)}
				</div>
			</div>
			{/* {!summeryLoader ? (
        <div className="wx__all_packBanner d-flex justify-content-between align-items-center">
          <h2 className="m-0">50% off on all packs</h2>
          <Button variant="outline">
            Explore Now
            <Icon className="ms_2" icon="arrow_forward" />
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded mt-3">
          <AllPackBanner viewBox="0 0 590 60" />
        </div>
      )} */}

			{/* <div className="wx__discover_webx card p-3 pb-0 mt-3">
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h5 className="m-0 text_h5 text_semibold">
						Discover Webx
					</h5>
					<div className="d-flex align-items-center">
						<Button size="sm">Explore More</Button>
						<Icon className="ms-3" icon="more_vert" />
					</div>
				</div>
				<div className="row">
					{staticContent?.tutorials?.map((item: any) => {
						return (
							<div
								key={item.id}
								className="wx__discover_cart col-md-4 col-sm-12 mb-3"
							>
								<iframe
									src={`https://www.youtube.com/embed/${getId(item.videoLink)}`}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>

								<span className="text_medium text__body mt-3">
									{sliceParagraph(item?.description, 15)}
								</span>
							</div>
						);
					})}
				</div>
			</div> */}
			{/* {!appsLoader ? (
				<div className='wx__apps_of_the_week'>
					<div className='d-flex justify-content-between align-items-center'>
						<div className='d-flex align-items-center'>
							<Icon className='trophy_icon' size={28} icon='emoji_events' />
							<div className='ms_2'>
								<h5 className='m-0 text_h5 text_semibold'>Apps Of The Week</h5>
								<span className='text_body text_regular'>
									Explore the endless possibilities with the help of our apps
								</span>
							</div>
						</div>
						<Icon icon='more_vert' />
					</div>
					<div className='row'>
						<DashboardApp apps={apps} />
						<div
							onClick={() => navigate('/apps/list')}
							style={{ cursor: 'pointer' }}
							className='col-md-3 col-sm-12 mt-3'
						>
							<div className='wx__exploreMore_card card '>
								<h2 className='m-0'>
									<span>Explore More</span>
									<Icon className='explore_more_icon ms-3' icon='arrow_circle_right' />
								</h2>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className='bg-white rounded mt-3'>
					<DashboardAppSkelton viewBox='0 0 595 205' />
				</div>
			)} */}
		</WxMainLg>
	);
};
export default Dashboard;
