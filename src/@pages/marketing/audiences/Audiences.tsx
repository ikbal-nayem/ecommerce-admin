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
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUDIENCES } from 'routes/path-name.route';
import { MarketingService } from 'services/api/marketing/Marketing.service';
import { ToastService } from 'services/utils/toastr.service';
import useDebounce from 'utils/debouncer';
import { searchParamsToObject } from 'utils/makeObject';
import AudiencesTable from './components/AudiencesTable';

const { MARKETING_AUDIENCE_SMS, MARKETING_AUDIENCE_EMAIL } = MASTER_META_KEY;

const tabList = [
	{ id: 0, title: 'SMS Audience', metaKey: MARKETING_AUDIENCE_SMS },
	{
		id: 1,
		title: 'Email (Coming Soon)',
		disable: true,
		metaKey: MARKETING_AUDIENCE_EMAIL,
	},
];

const Audiences: FC = () => {
	const [audienceType] = useState<any[]>(tabList);
	const [loading, setLoading] = useState<boolean>(true);
	const [isLoader, setIsLoader] = useState<boolean>(true);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [audienceData, setAudienceData] = useState<IOrderList[]>([]);
	const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [metaData, setMetaData] = useState<IRequestMeta>();
	const [searchParams, setSearchParams] = useSearchParams();
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
				setSearchParams({ type: 'MARKETING_AUDIENCE_SMS' });
			}, 100);
		} else {
			tabList.map((tab, i) => {
				tab.metaKey === type && setActiveTab(i);
			});
		}
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
			audienceStatusKey: params?.audienceType || null,
		};
		getOrder();
	}, [searchParams, paginationLimit, currentPage]);

	const getOrder = () => {};

	const onStatusChangeFromTab = (activeTab: number) => {
		let param: any = searchParamsToObject(searchParams);
		param.type = tabList[activeTab].metaKey;
		setSearchParams({ ...param });
		setActiveTab(activeTab);
	};

	const handleCreateAudience = () => {
		navigate(
			AUDIENCES +
				'/create' +
				'?audience=' +
				(searchParams.get('type') ? searchParams.get('type') : 'MARKETING_AUDIENCE_SMS')
		);
	};

	useEffect(() => {
		getAudienceList();
	}, [searchParams, currentPage, paginationLimit]);

	const getAudienceList = () => {
		MarketingService.getAudienceList({
			body: {
				title: searchKey,
				type: searchParams.get('type'),
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
				setAudienceData(res?.body);
				setMetaData(res?.meta);
			})
			.catch((err) => ToastService.error(err));
	};

	const onStatusChangeFormDropdown = (value: any) => {
		let param: any = searchParamsToObject(searchParams);
		param.type = value ? value : MARKETING_AUDIENCE_SMS;
		setSearchParams({ ...param });
		const found = tabList.filter((item) => item.metaKey === value);
		setActiveTab(found[0]?.id || 0);
	};

	const onConfirmDelete = () => {};

	return (
		<WxMainFull className='campaign-list-page'>
			<WxFormHeader
				title='Audiences'
				noBack
				rightContent={
					<WxButton
						variant='fill'
						onClick={() => handleCreateAudience()}
						disabled={!activePlan?.hasManualOrder}
					>
						{searchParams.get('type') === MARKETING_AUDIENCE_SMS
							? 'Create SMS Audience'
							: 'Create Email Audience'}
					</WxButton>
				}
			/>
			<div className='card'>
				{isLoader || (
					<>
						<div className='wx__mt-3 hide-mobile-view'>
							<Tabs
								option={tabList}
								renderTab={(item) => item?.title}
								currentIndex={activeTab}
								setCurrentIndex={onStatusChangeFromTab}
							/>
						</div>
						<div className='row wx__p-3 wx__pb-0'>
							<div className='col-lg-9 col-md-9 col-sm-12 wx__mb-3'>
								<WxInput
									type='search'
									placeholder='Search Audience Title'
									noMargin
									startIcon={<WxIcon icon='search' />}
									onChange={(e: any) => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className='col-lg-3 col-md-3 col-sm-6 wx__mb-3'>
								<WxSelect
									valuesKey='metaKey'
									textKey='title'
									noMargin
									placeholder='Type'
									options={audienceType}
									value={searchParams.get('type') || ''}
									onChange={(e: any) => onStatusChangeFormDropdown(e.target.value)}
								/>
							</div>
							{loading ? <TableLoader /> : null}
						</div>
					</>
				)}
				<div>
					{!isLoader && !loading && !audienceData.length ? (
						<WxNotFound
							title='No Audience found!'
							btn_link={
								activePlan?.hasManualOrder
									? AUDIENCES +
									  '/create' +
									  '?audience=' +
									  (searchParams.get('type') ? searchParams.get('type') : 'MARKETING_CAMPAIGNS_SMS')
									: null
							}
							btn_text={
								searchParams.get('type') === MARKETING_AUDIENCE_SMS
									? 'Create SMS Audience'
									: 'Create Email Audience'
							}
						/>
					) : null}
					{isLoader ? (
						<div className='wx__bg-white rounded'>
							<ProductTableSkelton viewBox='0 0 600 230' />
						</div>
					) : (
						<div>
							{audienceData?.length ? (
								<>
									<AudiencesTable audienceData={audienceData} />
									<div className='pagination_div wx__p-4'>
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
export default Audiences;
