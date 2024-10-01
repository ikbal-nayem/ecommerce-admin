import WxAlert from '@components/Alert/WxAlert';
import { ConfirmationModal } from '@components/ConfirmationModal/ConfirmationModal';
import Invoice from '@components/Invoice/Invoice';
import InvoiceTable from '@components/Invoice/InvoiceTable';
import WxMainFull from '@components/MainContentLayout/WxMainFull';
import WxNotFound from '@components/NotFound/WxNotFound';
import WxSelect from '@components/Select/WxSelect';
import TableLoader from '@components/TableLoader/TableLoader';
import WxButton from '@components/WxButton';
import { WxFormHeader } from '@components/WxFormLayout';
import WxIcon from '@components/WxIcon/WxIcon';
import WxInput from '@components/WxInput';
import WxPagination from '@components/WxPagination/WxPagination';
import ProductTableSkelton from '@components/WxSkelton/ProductTableSkelton';
import Tabs from '@components/WxTabs/WxTabs';
import { IRequestMeta, IStatus } from '@interfaces/common.interface';
import { IOrderList } from '@interfaces/order.interface';
import { MASTER_META_KEY, MASTER_META_TYPE } from 'config/constants';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ORDER_CREATE, SETTINGS_PRICING_PLAN } from 'routes/path-name.route';
import { StatusService } from 'services/api/admin/Status.service';
import { OrderService } from 'services/api/Order.service';
import { ToastService } from 'services/utils/toastr.service';
import useDebounce from 'utils/debouncer';
import { searchParamsToObject } from 'utils/makeObject';
import skeltonLoader from 'utils/skeltonLoader';
import OrderListTable from './components/OrderTable';

import './Orders.scss';

const tabList = [
	MASTER_META_KEY.ORDER_STATUS_TYPE_PENDING,
	MASTER_META_KEY.ORDER_STATUS_TYPE_DELIVERED,
	MASTER_META_KEY.ORDER_STATUS_TYPE_COMPLETED,
	MASTER_META_KEY.PAYMENT_STATUS_TYPE_PAID,
	MASTER_META_KEY.PAYMENT_STATUS_TYPE_UNPAID,
];

const Orders = () => {
	const [paymentStatus, setPaymentStatus] = useState<IStatus[]>([]);
	const [orderStatus, setOrderStatus] = useState<IStatus[]>([]);
	const [statusList, setStatusList] = useState<IStatus[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isLoader, setIsLoader] = useState<boolean>(true);
	const [ordersData, setOrdersData] = useState<IOrderList[]>([]);
	const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [metaData, setMetaData] = useState<IRequestMeta>();
	const [searchParams, setSearchParams] = useSearchParams();
	const [currentPage, setCurrentPage] = useState<number>(
		Number(searchParams.get('page')) ? Number(searchParams.get('page')) - 1 : null || 0
	);
	const [paginationLimit, setPaginationLimit] = useState(10);
	const [searchQuery, setSearchQuery] = useState<string>(null);
	const [invoiceData, setInvoiceData] = useState<any>({});
	const [invoiceItemData, setInvoiceItemData] = useState<any[]>([]);
	const filterParams = useRef(null);
	const deleteItem = useRef(null);
	const navigate = useNavigate();

	const { activePlan } = useSelector((state: any) => state?.user);

	let searchKey: string = useDebounce(searchQuery, 500);

	useEffect(() => {
		// get payment and order status list initially
		const order = StatusService.getOrderStatus();
		const payment = StatusService.getPaymentStatus();
		Promise.all([order, payment])
			.then(([order, payment]) => {
				setStatusList([
					{ title: 'All Orders' },
					...order.body?.filter((li: IStatus) => tabList.some((t) => t === li.metaKey)),
					...payment.body?.filter((li: IStatus) => tabList.some((t) => t === li.metaKey)),
				]);
				// isInit.current = false;
				setOrderStatus(order.body);
				setPaymentStatus(payment.body);
				setSearchParams(searchParamsToObject(searchParams));
			})
			.finally(() => skeltonLoader(setIsLoader));
	}, []);

	useEffect(() => {
		const params: any = searchParamsToObject(searchParams);
		searchKey ? (params.searchKey = searchKey) : delete params.searchKey;
		setSearchParams({ ...params });
	}, [searchKey]);

	useEffect(() => {
		const params: any = searchParamsToObject(searchParams);
		filterParams.current = {
			...params,
			paymentStatusKey: params?.paymentStatus || null,
			orderStatusKey: params?.orderStatus || null,
		};
		getOrder();
	}, [searchParams, paginationLimit, currentPage]);

	const getOrder = () => {
		setLoading(true);
		delete filterParams.current.paymentStatus;
		delete filterParams.current.orderStatus;
		OrderService.get({
			meta: {
				offset: currentPage,
				limit: paginationLimit,
				sort: [{ field: 'createdOn', order: 'desc' }],
			},
			body: filterParams.current,
		})
			.then((res) => {
				setOrdersData(res.body);
				setMetaData(res.meta || {});
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => {
				setLoading(false);
				skeltonLoader(setIsLoader);
			});
	};

	const onStatusChangeFromTab = (activeTab: number) => {
		let params: any = searchParamsToObject(searchParams);
		if (activeTab !== 0) {
			if (statusList[activeTab]?.metaType === MASTER_META_TYPE.PAYMENT_STATUS_TYPE) {
				params.paymentStatus = statusList[activeTab].metaKey;
				delete params.orderStatus;
			} else if (statusList[activeTab]?.metaType === MASTER_META_TYPE.ORDER_STATUS_TYPE) {
				params.orderStatus = statusList[activeTab].metaKey;
				delete params.paymentStatus;
			}
		} else {
			delete params.paymentStatus;
			delete params.orderStatus;
		}
		setSearchParams({ ...params });
	};

	const onStatusChangeFormDropdown = (e: any, statusType: string) => {
		const params: any = searchParamsToObject(searchParams);
		const status = e.target.value;
		if (statusType === 'PAYMENT') status ? (params.paymentStatus = status) : delete params.paymentStatus;
		else if (statusType === 'ORDER') status ? (params.orderStatus = status) : delete params.orderStatus;
		setSearchParams({ ...params });
	};

	const onDelete = (order: string) => {
		if (!order) return;
		deleteItem.current = order;
		setConfirmationModal(true);
	};

	const onConfirmDelete = () => {
		const { orderId } = deleteItem.current;
		if (!orderId) {
			setConfirmationModal(false);
			deleteItem.current = null;
			return;
		}
		setIsSubmitting(true);
		OrderService.delete([orderId])
			.then((res) => {
				ToastService.success(res?.message);
				setConfirmationModal(false);
				deleteItem.current = null;
				getOrder();
			})
			.catch((err) => {
				ToastService.error(err.message);
			})
			.finally(() => setIsSubmitting(false));
	};

	let activeTabIdx = statusList.findIndex(
		(val) => val.metaKey === (searchParams.get('paymentStatus') || searchParams.get('orderStatus'))
	);
	activeTabIdx = activeTabIdx >= 0 ? activeTabIdx : 0;

	return (
		<WxMainFull className='order-list-page'>
			<WxFormHeader
				title='Order'
				noBack
				rightContent={
					<WxButton
						variant='fill'
						onClick={() => navigate(ORDER_CREATE)}
						disabled={!activePlan?.hasManualOrder}
					>
						Create Order
					</WxButton>
				}
			/>
			{!activePlan?.hasManualOrder ? (
				<WxAlert>
					Please upgrade your <Link to={SETTINGS_PRICING_PLAN}>plan</Link> to create a manual order.
				</WxAlert>
			) : null}
			<div className='card'>
				{isLoader || (
					<>
						<div className='mt-3 hide-mobile-view'>
							<Tabs
								option={statusList}
								renderTab={(item) => item?.title}
								currentIndex={activeTabIdx}
								setCurrentIndex={onStatusChangeFromTab}
							/>
						</div>
						<div className='row p-3 pb-0'>
							<div className='col-lg-8 col-md-6 col-sm-12 mb-3'>
								<WxInput
									type='search'
									placeholder='Search orders'
									noMargin
									startIcon={<WxIcon icon='search' />}
									onChange={(e: any) => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className='col-lg-2 col-md-3 col-sm-6 mb-3'>
								<WxSelect
									valuesKey='metaKey'
									textKey='title'
									noMargin
									placeholder='Payment Status'
									options={paymentStatus}
									value={searchParams.get('paymentStatus') || ''}
									onChange={(e) => onStatusChangeFormDropdown(e, 'PAYMENT')}
								/>
							</div>
							<div className='col-lg-2 col-md-3 col-sm-6 mb-3'>
								<WxSelect
									valuesKey='metaKey'
									textKey='title'
									noMargin
									placeholder='Order Status'
									options={orderStatus}
									value={searchParams.get('orderStatus') || ''}
									onChange={(e) => onStatusChangeFormDropdown(e, 'ORDER')}
								/>
							</div>
							{loading ? <TableLoader /> : null}
						</div>
					</>
				)}
				<div>
					{!isLoader && !loading && !ordersData.length ? (
						<WxNotFound
							title='No order found!'
							description={
								!activePlan?.hasManualOrder ? (
									<>
										Please upgrade your <Link to={SETTINGS_PRICING_PLAN}>plan</Link> to create a manual order.
									</>
								) : (
									''
								)
							}
							btn_link={activePlan?.hasManualOrder ? ORDER_CREATE : null}
							btn_text='Create Order'
						/>
					) : null}
					{isLoader ? (
						<div className='bg-white rounded'>
							<ProductTableSkelton viewBox='0 0 600 230' />
						</div>
					) : (
						<div>
							{ordersData?.length ? (
								<>
									<OrderListTable ordersData={ordersData} onDelete={onDelete} />
									<div className='pagination_div p-4'>
										<WxPagination
											meta={metaData}
											currentPage={currentPage}
											setCurrentPage={setCurrentPage}
											paginationLimit={paginationLimit}
											setPaginationLimit={setPaginationLimit}
										/>
									</div>
								</>
							) : null}
						</div>
					)}
				</div>
				<ConfirmationModal
					onConfirm={onConfirmDelete}
					isOpen={confirmationModal}
					onClose={() => setConfirmationModal(false)}
					isSubmitting={isSubmitting}
					title='Order Delete Confirmation!'
					body={
						<span>
							Do you want to delete <b>{deleteItem.current?.customerName}</b>
							's order? This action cannot be undone.
						</span>
					}
				/>
			</div>
			<Invoice invoiceData={invoiceData} />
			<InvoiceTable data={invoiceItemData} />
		</WxMainFull>
	);
};

export default Orders;
