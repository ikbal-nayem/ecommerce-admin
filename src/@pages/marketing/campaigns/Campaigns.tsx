import { ConfirmationModal } from '@components/ConfirmationModal/ConfirmationModal';
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
import { IRequestMeta } from '@interfaces/common.interface';
import { IOrderList } from '@interfaces/order.interface';
import { MASTER_META_KEY } from 'config/constants';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CAMPAIGNS } from 'routes/path-name.route';
import { MarketingService } from 'services/api/marketing/Marketing.service';
import { ToastService } from 'services/utils/toastr.service';
import useDebounce from 'utils/debouncer';
import { searchParamsToObject } from 'utils/makeObject';
import './Campaigns.scss';
import CampaignTable from './components/CampaignTable';

const statusList = [
	{ id: 1, title: 'Draft' },
	{ id: 2, title: 'Submit' },
];

const tabList = [
	{ title: 'SMS Campaign', metaKey: MASTER_META_KEY.MARKETING_CAMPAIGNS_SMS },
	{
		title: 'Facebook Campaign',
		metaKey: MASTER_META_KEY.MARKETING_CAMPAIGNS_FB,
	},
];

const Campaigns = () => {
	const [campaignStatus] = useState<any[]>(statusList);
	const [loading, setLoading] = useState<boolean>(true);
	const [isLoader, setIsLoader] = useState<boolean>(true);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [campaignData, setCampaignData] = useState<IOrderList[]>([]);
	const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [metaData] = useState<IRequestMeta>();
	const [searchParams, setSearchParams] = useSearchParams();
	const [status, setStatus] = useState<string>(searchParams.get('status') || '');
	const [currentPage, setCurrentPage] = useState<number>(
		Number(searchParams.get('page')) ? Number(searchParams.get('page')) - 1 : null || 0
	);
	const [paginationLimit, setPaginationLimit] = useState(10);
	const [searchQuery, setSearchQuery] = useState<string>(null);
	const filterParams = useRef(null);
	const deleteItem = useRef(null);

	const navigate = useNavigate();

	const { activePlan } = useSelector((state: any) => state?.user);

	let searchKey: string = useDebounce(searchQuery, 500);

	useEffect(() => {
		setTimeout(() => {
			setIsLoader(false);
			setLoading(false);
		}, 1000);
	}, []);

	useEffect(() => {
		const { type }: any = searchParamsToObject(searchParams);
		if (!type) {
			setTimeout(() => {
				setSearchParams({ type: 'MARKETING_CAMPAIGNS_SMS' });
			}, 100);
		} else {
			tabList.map((tab, i) => {
				tab.metaKey === type && setActiveTab(i);
			});
		}
	}, [searchParams]);

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
			campaignStatusKey: params?.campaignStatus || null,
		};
		getCampaignsList();
	}, [searchParams, paginationLimit, currentPage]);

	const onStatusChangeFromTab = (activeTab: number) => {
		let param: any = searchParamsToObject(searchParams);
		param.type = tabList[activeTab].metaKey;
		setSearchParams({ ...param });
		setActiveTab(activeTab);
	};

	const handleCreateCampaign = () => {
		navigate(
			CAMPAIGNS +
				'/create' +
				'?campaign=' +
				(searchParams.get('type') ? searchParams.get('type') : 'MARKETING_CAMPAIGNS_SMS')
		);
	};

	const getCampaignsList = () => {
		MarketingService.getSMSCampaignList({
			body: {
				name: searchKey,
				type: searchParams.get('type'),
				status: status,
			},
			meta: {
				offset: currentPage,
				limit: paginationLimit,
				sort: [
					{
						order: 'desc',
						field: 'createdOn',
					},
				],
			},
		})
			.then((res) => {
				if (!res.body.length) return;
				res.body.map((camp) => (camp.audiences = camp.audiences.map((aud) => aud?.audienceId)));
				setCampaignData(res.body);
			})
			.catch((err) => ToastService.error(err));
	};

	const onStatusChangeFormDropdown = (value: any) => {
		console.log(value);
		let param: any = searchParamsToObject(searchParams);

		console.log(param);
		setStatus(value);

		if (value) {
			param.status = value;
		} else {
			searchParams.delete('status');
		}

		setSearchParams({ ...param });
		// const found = tabList.filter((item) => item.metaKey === value);
		// setActiveTab(found[0]?.id || 0);
	};

	const onConfirmDelete = () => {};

	return (
		<WxMainFull className='campaign-list-page'>
			<WxFormHeader
				title='Campaigns'
				noBack
				rightContent={
					<WxButton
						variant='fill'
						onClick={() => handleCreateCampaign()}
						disabled={!activePlan?.hasManualOrder}
					>
						Create Campaign
					</WxButton>
				}
			/>
			<div className='card'>
				{isLoader || (
					<>
						<div className='mt-3 hide-mobile-view'>
							<Tabs
								option={tabList}
								renderTab={(item) => item?.title}
								currentIndex={activeTab}
								setCurrentIndex={onStatusChangeFromTab}
							/>
						</div>
						<div className='row p-3 pb-0'>
							<div className='col-lg-9 col-md-9 col-sm-12 mb-3'>
								<WxInput
									type='search'
									placeholder='Search Campaigns Name'
									noMargin
									startIcon={<WxIcon icon='search' />}
									onChange={(e: any) => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className='col-lg-3 col-md-3 col-sm-6 mb-3'>
								<WxSelect
									valuesKey='title'
									textKey='title'
									noMargin
									placeholder='Status'
									options={campaignStatus}
									value={searchParams.get('campaignStatus') || ''}
									onChange={(e) => onStatusChangeFormDropdown(e.target.value)}
								/>
							</div>
							{loading ? <TableLoader /> : null}
						</div>
					</>
				)}
				<div>
					{!isLoader && !loading && !campaignData.length ? (
						<WxNotFound
							title='No Campaign found!'
							btn_link={
								activePlan?.hasManualOrder
									? CAMPAIGNS +
									  '/create' +
									  '?campaign=' +
									  (searchParams.get('type') ? searchParams.get('type') : 'MARKETING_CAMPAIGNS_SMS')
									: null
							}
							btn_text='Create campaign'
						/>
					) : null}
					{isLoader ? (
						<div className='bg-white rounded'>
							<ProductTableSkelton viewBox='0 0 600 230' />
						</div>
					) : (
						<div>
							{campaignData?.length ? (
								<>
									<CampaignTable campaignData={campaignData} />
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
		</WxMainFull>
	);
};

export default Campaigns;
