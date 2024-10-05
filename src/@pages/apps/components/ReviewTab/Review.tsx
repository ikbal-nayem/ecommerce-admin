import WxSelect from "@components/Select/WxSelect";
import {Button} from "@components/Button";
import WxIcon from "@components/Icon";
import { notification } from "@components/WxNotificaton/index";
import RatingProgressBar from "@components/RatingProgressBar";
import { IAppRatingCount, IRatingPreview } from "@interfaces/app.interface";
import { AppsReviewService } from "services/api/Apps.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import "./Review.scss";

interface IReview {
	appId: string;
}

const ratingFilterOption = [
	{ id: 0, text: "All" },
	{ id: 1, text: "Most Rating" },
];

const makeProgressBarData = (value: IAppRatingCount) => {
	let temp = [
		value.ratingOne,
		value.ratingTwo,
		value.ratingThree,
		value.ratingFour,
		value.ratingFive,
	];
	let tempData = [];
	let tempSum = temp.reduce((prev, b) => prev + b);
	for (let i = 0; i < temp.length; i++) {
		tempData = [
			{
				star: i + 1,
				rating: temp[i],
				progressWidth: (temp[i] * 100) / tempSum,
			},
			...tempData,
		];
	}
	return tempData;
};

const AppReview = ({ appId }: IReview) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [reviewData, setReviewData] = useState<any[]>([]);
	const [ratingProgress, setRatingProgress] = useState<IRatingPreview[]>();
	const [readMoreBtn, setReadMOreBtn] = useState<boolean>(true);
	const [helpfulNotHelpful, setHelpfulNotHelpful] = useState<any>({
		index: -1,
		helpful: 0,
		notHelpful: 0,
	});

	useEffect(() => {
		setIsLoading(true);
		const reviewReq = AppsReviewService.getReviewList({
			body: { appId, isPublished: true },
		});
		const ratingReq = AppsReviewService.getRatingById(appId);
		Promise.all([reviewReq, ratingReq])
			.then(([reviewRes, ratingRes]) => {
				setReviewData(reviewRes.body);
				setRatingProgress(makeProgressBarData(ratingRes.body));
			})
			.finally(() => setIsLoading(false));
	}, []);

	const onChangeCategory = (value: any) => {
		console.log(
			"🚀 ~ file: Products.tsx ~ line 17 ~ onChangePaymentStatus ~ value",
			value.target.value
		);
	};

	// const setReviewFun = () => {
	//   const userRev = [...reviewData?.userReview];
	//   if (reviewData?.userReview?.length >= userReview.length + 4) {
	//     setUserReview(userRev.splice(0, userReview.length + 4));
	//     return;
	//   }
	//   setUserReview(userRev.splice(0, reviewData?.userReview?.length));
	// };

	const showFullData = (tagId) => {
		document.getElementById(tagId).classList.remove("user_review_hide_msg");
		setReadMOreBtn(false);
	};

	const onReactionSubmit = (index, reviewId, data) => {
		let value = {
			id: reviewId,
			appReviewId: reviewId,
			emailMobile: "01997766488",
			firstName: "HR",
			lastName: "Bappy",
			isPublish: true,
			isLiked: false,
			isunLiked: false,
		};
		if (data === "isLiked") {
			value.isLiked = true;
			value.isunLiked = false;
		}
		if (data === "isunLiked") {
			value.isLiked = false;
			value.isunLiked = true;
		}

		AppsReviewService.reviewReaction(value)
			.then((res: any) => {
				if (res.status === 200) {
					notification({ status: "success", data: res.message });
					const timer = setTimeout(() => {
						setHelpfulNotHelpful({
							index: index,
							helpful: res.body[0]?.helpFull,
							notHelpful: res.body[0]?.notHelpFull,
						});
					}, 1000);
				}
			})
			.catch((err) => ToastService.error(err))
			.finally(() => setIsLoading(false));
	};

	if (isLoading) return <Preloader />;

	return (
		<div className="wx__review">
			<div className="row wx__review_top">
				<div className="col-lg-6 col-md-12 col-sm-12 ">
					<h5 className="text_semibold mb-3">Ratings</h5>
					<p className="text_body text_regular">
						Overall Rating &nbsp;&nbsp;
						<WxIcon className="small_icon" icon="star" variants="filled" />
						{(reviewData.length && reviewData[0]?.appRegisterDTO?.avgRating) ||
							0}
						/5 (
						{(reviewData.length &&
							reviewData[0]?.appRegisterDTO?.totalReview) ||
							0}{" "}
						Review)
					</p>
					{/* <p className=" text_regular w-100">
						**You must be logged in to submit a review.
					</p> */}
				</div>
				<div className="col-lg-6 col-md-12 col-sm-12 mb-3">
					{ratingProgress?.map((item, index) => (
						<RatingProgressBar
							key={index}
							star={item.star}
							progressWidth={item.progressWidth}
							review={item.rating}
						/>
					))}
				</div>
			</div>
			<div className="row wx__review_bottom">
				{reviewData?.length ? (
					<div className="wx__user_review pt-3">
						<div className="d-flex justify-content-between align-items-center">
							<div className="d-flex align-items-center w-100">
								<p className="text_small text_regular">
									{/* Sort {data?.length} Reviews By */}
								</p>
								<div className="col-md-6 col-sm-12">
									<WxSelect
										defaultValue="Payment Status"
										valuesKey="id"
										textKey="text"
										options={ratingFilterOption}
										onChange={onChangeCategory}
									/>
								</div>
							</div>
							<div className="w-100 d-flex justify-content-end align-items-center">
								<Button variant="outline">Create Review</Button>
							</div>
						</div>
						<div>
							{reviewData.map((item, index) => {
								return (
									<div key={index} className="wx__single_review">
										<p className="text_medium text_reguar">
											{item?.firstName} {item?.lastName}
										</p>
										<div className="d-flex align-items-center">
											<div>
												{/* {item?.ratingMax?.map((rating, idx) => {
                          return (
                            <WxIcon
                              className="small_icon"
                              icon="star"
                              variants="filled"
                            />
                          );
                        })} */}

												<WxIcon
													className="small_icon"
													icon="star"
													variants="filled"
												/>
												<WxIcon
													className="small_icon"
													icon="star"
													variants="filled"
												/>
												<WxIcon
													className="small_icon"
													icon="star"
													variants="filled"
												/>
												<WxIcon
													className="small_icon"
													icon="star"
													variants="filled"
												/>
											</div>
											<p className="text_body text_regular mb-0">
												{item.dateTime}
											</p>
										</div>
										<p
											className="w-100 text_regular user_review_hide_msg"
											id={"user_review" + index}
										>
											{item.reviewMsg}
										</p>
										{readMoreBtn ? (
											<Button
												variant="none"
												size="sm"
												onClick={() => showFullData("user_review" + index)}
											>
												Read Full Review
											</Button>
										) : null}

										<div className="d-flex align-items-center">
											<div className="d-flex align-items-center helpful">
												<Button
													variant="none"
													onClick={() =>
														onReactionSubmit(index, item.id, "isLiked")
													}
												>
													<WxIcon
														className="icon "
														icon="thumb_up_off_alt"
														variants="round"
													/>
												</Button>
												{helpfulNotHelpful.index === index ? (
													<span>
														HELPFUL ({helpfulNotHelpful?.helpful | 0})
													</span>
												) : (
													<span>
														HELPFUL ({item?.reactionCountDTO[0]?.helpFull | 0})
													</span>
												)}
											</div>
											<div className="d-flex align-items-center not-helpful">
												<Button
													variant="none"
													onClick={() =>
														onReactionSubmit(index, item.id, "isunLiked")
													}
												>
													<WxIcon
														className="icon "
														icon="thumb_down"
														variants="outlined"
													/>
												</Button>
												{helpfulNotHelpful.index === index ? (
													<span>
														NOT HELPFUL ({helpfulNotHelpful?.notHelpful | 0})
													</span>
												) : (
													<span>
														NOT HELPFUL (
														{item?.reactionCountDTO[0]?.notHelpFull | 0})
													</span>
												)}
											</div>
										</div>
										{item.reply?.map((reply, indx) => {
											return (
												<div className="wx__review_replay mb-3" key={indx}>
													<p className="text_medium">{reply.name}</p>
													<p className="text_body text_regular mb-0">
														{reply.dateTime}
													</p>
													<p className="w-100 text_regular">
														{reply.replyMsg}
													</p>
												</div>
											);
										})}
									</div>
								);
							})}
						</div>
						{/* <div className="mt-3">
                    <Button variant="outline">
                      Read More Reviews
                    </Button>
                  </div> */}
					</div>
				) : (
					<div className="wx__user_review_0 text-center">
						<WxIcon icon="vector" variants="filled" />
						<div>
							<WxIcon icon="star" variants="filled" />
							<WxIcon icon="star" variants="filled" />
							<WxIcon icon="star" variants="filled" />
						</div>
						<h3 className="text_regular">No review found!</h3>
						<p className="text_regular">
							You can write a review about your experience by using the write a
							review button.
						</p>
						<Button className="m-auto" variant="fill">
							Create Review
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};;;;;;;;;;

export default AppReview;
