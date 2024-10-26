import Icon from '@components/Icon';
import Select from '@components/Select/Select';
import { IMeta } from '@interfaces/common.interface';
import clsx from 'clsx';
import { memo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { isNull } from 'utils/check-validity';
import { searchParamsToObject } from 'utils/makeObject';
import './pagination.scss';

const limitList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

interface ITablePagination {
	meta?: IMeta;
	setSearchParams?: boolean;
	onPaginationChange?: (meta: IMeta) => void;
}

const Pagination = ({ meta, setSearchParams, onPaginationChange }: ITablePagination) => {
	const [pages, setPages] = useState([1]);
	const [sp, setSP] = useSearchParams();
	const navigator = useNavigate();

	let { totalRecords, currentPageTotal, limit, nextPage, page: currentPage, prevPage, totalPages } = meta;

	limit = limit || 10;

	useEffect(() => {
		calculatePages(meta.totalPages);
	}, [meta]);

	// calculating the pages on per pages changes
	const calculatePages = (total: number) => {
		let pp = [];
		for (let p = 1; p <= total; p++) {
			pp.push(p);
		}
		setPages(pp);
	};

	// this function is defining the first number of slice
	const firstIndexOfSlice = (): number => {
		const totalPage = pages.length - 1;

		// if the current page is upper 0 and under 3 then it will always start from 1
		return currentPage >= 0 && currentPage <= 3
			? 0
			: // if current page is upper than totalPage exmp: 28 in 27,28,29,30,31 ; and it will work from 28 to 31 but to meet this value should full fill the condition and it is totalPage should me upper than 10
			currentPage > totalPage - 4 && totalPage >= currentPage && totalPage > 10
			? totalPage - 4
			: // and if the totalPage and current page is same in last then it show like this exmp: 7 inn ,...,5,6,7
			totalPage === currentPage
			? currentPage - 2
			: // and normally it's always shows from current page page previous page
			  currentPage - 1;
	};

	// this function is defining the last number of slice
	const lastIndexOfSlice = (): number => {
		// if the current page is under 5 then it will show 1-5 pages
		return currentPage >= 0 && currentPage <= 3
			? 5
			: // if current page page is exm: 28 in 27,28,29,30,31 then it will show like this and for this page length should be bigger than 10
			currentPage >= pages.length - 4 && pages.length > 10
			? pages.length
			: // otherwise it will show current page next page exm: 7 in 6,7,8
			  currentPage + 2;
	};

	const onLimitChange = (e) => {
		onPaginationChange && onPaginationChange({ ...meta, page: 1, limit: +e.target.value });
		setSearchParams && setSP({ ...searchParamsToObject(sp), page: '1', limit: e.target.value });
	};

	const handleActivePage = (e?: any, page?: number) => {
		const pageNumber = document.querySelector('.page_number');
		if (!pageNumber.querySelector('.active-page').contains(e.target)) {
			onPaginationChange && onPaginationChange({ ...meta, page });
			// setSearchParams && navigator(`?page=${page}&limit=${limit}`);
			setSearchParams &&
				setSP({ ...searchParamsToObject(sp), page: page?.toString(), limit: limit?.toString() });
		}
	};

	return (
		<div className='wx__table_pagination_main'>
			<div className='d-flex align-items-center gap-1'>
				<p className='mb-0'>Results per page</p>
				<Select
					options={limitList}
					defaultValue={limit?.toString()}
					noMargin
					valuesKey={'object'}
					onChange={onLimitChange}
				/>
			</div>

			<div className='wx__table_pagination'>
				<span className='wx__pagination_text'>
					Showing {currentPage * limit - limit + 1}-
					{currentPageTotal < limit ? currentPageTotal : currentPage * limit} of {totalRecords}
				</span>

				<div className='wx__pagination_div'>
					<ul className='wx__ul'>
						<li
							onClick={(e) => {
								!isNull(prevPage) && handleActivePage(e, 1);
							}}
							className={clsx('wx__table_single_li pagination_btn left_btn', {
								'disable-page': isNull(prevPage),
							})}
						>
							<Icon icon='first_page' className='span' />
						</li>
						<li
							onClick={(e) => {
								!isNull(prevPage) && handleActivePage(e, prevPage);
							}}
							className={clsx('wx__table_single_li pagination_btn left_btn', {
								'disable-page': isNull(prevPage),
							})}
						>
							<Icon icon='chevron_left' className='span' />
						</li>

						{pages.length >= 5 && currentPage > 3 && (
							<li style={{ color: '#1f1f1f' }} className='wx__table_single_li disable-page'>
								...
							</li>
						)}

						<div className='page_number'>
							{pages.slice(firstIndexOfSlice(), lastIndexOfSlice()).map((page, index) => {
								return (
									<li
										className={clsx('wx__table_single_li', { 'active-page': currentPage === page })}
										key={index}
										onClick={(e: any) => handleActivePage(e, page)}
									>
										{page}
									</li>
								);
							})}
						</div>

						{pages.length >= 5 && currentPage < pages.length - 2 && (
							<li style={{ color: '#1f1f1f' }} className='wx__table_single_li disable-page '>
								...
							</li>
						)}

						<li
							onClick={(e) => {
								!isNull(nextPage) && handleActivePage(e, nextPage);
							}}
							className={clsx('wx__table_single_li pagination_btn right_btn', {
								'disable-page': isNull(nextPage),
							})}
						>
							<Icon icon='chevron_right' className='span' />
						</li>

						<li
							onClick={(e) => {
								!isNull(nextPage) && handleActivePage(e, totalPages);
							}}
							className={clsx('wx__table_single_li pagination_btn right_btn', {
								'disable-page': isNull(nextPage),
							})}
						>
							<Icon icon='last_page' className='span' />
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default memo(Pagination);
