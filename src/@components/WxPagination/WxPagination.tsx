import Icon from "@components/Icon";
import { IRequestMeta } from "@interfaces/common.interface";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./wxpagination.scss";

const defaultMeta = {
  offset: 0,
  prevOffset: 0,
  nextOffset: 0,
  limit: 10,
  totalRecords: 10,
  resultCount: 10,
  totalPageCount: 1,
  sort: [
    {
      order: "desc",
      field: "createdOn",
    },
  ],
};

const perPages = [10, 20, 30, 40, 50];

interface ITablePagination {
  meta?: IRequestMeta;
  currentPage?: number;
  setCurrentPage?: any;
  paginationLimit?: any;
  setPaginationLimit?: any;
}

const WxPagination = ({
	meta = defaultMeta,
	setCurrentPage,
	setPaginationLimit,
}: ITablePagination) => {
	const [pages, setPages] = useState([1]);

	const navigator = useNavigate();

	const {
		totalRecords,
		resultCount,
		limit,
		nextOffset,
		offset,
		prevOffset,
		totalPageCount,
	} = meta;

	const paginationLimit = limit;
	const currentPage = offset;

	let showingFrom = currentPage <= 0 ? 1 : currentPage * paginationLimit + 1;

	let showingTo =
		currentPage <= 0
			? paginationLimit
			: paginationLimit >= totalRecords
			? totalRecords
			: paginationLimit * (currentPage + 1);
	showingTo = showingTo > totalRecords ? totalRecords : showingTo;

	useEffect(() => {
		calculatePages(totalPageCount);
	}, [totalPageCount]);

	// function for perpage change
	const onPerPageChange = (pageNumber: number) => {
		const limit = Number(pageNumber);
		setPaginationLimit(limit);
		setCurrentPage(0);
	};

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

	const handleActivePage = (e?: any, page?: any) => {
		const pageNumber = document.querySelector(".page_number");

		if (!pageNumber.querySelector(".active-page").contains(e.target)) {
			setCurrentPage(page);
			navigator("?page=" + (page + 1));
		}
	};

	return (
		<div className="wx__table_pagination_main">
			{/* table per page number selection start */}
			<div className="wx__perpage_data me-2">
				<p>Results per page</p>
				<select
					defaultValue={paginationLimit}
					onChange={(e: any) => onPerPageChange(e.target.value)}
					role="button"
				>
					{perPages?.map((page, index) => (
						<option value={page} key={index}>
							{page}
						</option>
					))}
				</select>
			</div>
			{/* table per page number selection end */}

			<div className="wx__table_pagination">
				<span className="wx__pagination_text">
					Showing {showingFrom}-{showingTo} of {totalRecords}
					{showingFrom <= 1}
				</span>

				<div className="wx__pagination_div">
					<ul className="wx__ul">
						{/* paginatin left button start */}
						<li
							onClick={(e) => {
								currentPage >= 1 && handleActivePage(e, 0);
							}}
							className={`wx__table_single_li pagination_btn left_btn ${
								(currentPage === 0 || totalPageCount === 1) && "disable-page"
							}`}
						>
							<Icon icon="first_page" className="span" />
						</li>
						<li
							onClick={(e) => {
								handleActivePage(e, prevOffset);
							}}
							className={`wx__table_single_li pagination_btn left_btn ${
								(currentPage === 0 || totalPageCount === 1) && "disable-page"
							}`}
						>
							<Icon icon="chevron_left" className="span" />
						</li>
						{/* paginatin left button end */}

						{pages.length >= 5 && currentPage > 3 && (
							<li
								style={{ color: "#1f1f1f" }}
								className="wx__table_single_li disable-page"
							>
								...
							</li>
						)}

						{/* main div for dynamic page number start*/}
						<div className="page_number">
							{pages
								.slice(firstIndexOfSlice(), lastIndexOfSlice())
								.map((page, index) => {
									return (
										<li
											className={`wx__table_single_li 
                    ${currentPage + 1 === page ? "active-page" : ""}
                  `}
											key={index}
											onClick={(e: any) => {
												handleActivePage(e, page - 1);
											}}
										>
											{page}
										</li>
									);
								})}
						</div>
						{/* main div for dynamic page number end*/}

						{pages.length >= 5 && currentPage < pages.length - 2 && (
							<li
								style={{ color: "#1f1f1f" }}
								className="wx__table_single_li disable-page "
							>
								...
							</li>
						)}

						{/* paginatin right button start */}

						<li
							onClick={(e) => {
								// setCurrentPage(nextOffset);
								handleActivePage(e, nextOffset);
							}}
							className={`wx__table_single_li pagination_btn right_btn ${
								(currentPage + 1 === totalPageCount || totalPageCount <= 0) &&
								"disable-page"
							}`}
						>
							<Icon icon="chevron_right" className="span" />
						</li>

						<li
							onClick={(e) => {
								currentPage < pages.length &&
									handleActivePage(e, totalPageCount - 1);
								// setCurrentPage(totalPageCount - 1);
							}}
							className={`wx__table_single_li pagination_btn right_btn ${
								(currentPage + 1 === totalPageCount || totalPageCount <= 0) &&
								"disable-page"
							}`}
						>
							<Icon icon="last_page" className="span" />
						</li>
						{/* paginatin left button end */}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default memo(WxPagination);
