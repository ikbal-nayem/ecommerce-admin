import WxNotFound from "@components/NotFound/WxNotFound";
import WxProgressBar from "@components/RatingProgressBar";
import WxButton from "@components/WxButton";
import WxIcon from "@components/WxIcon/WxIcon";
import { IReview } from "@interfaces/app.interface";
import { ThemeService } from "services/api/onlineStore/themes/Theme.service";
import Preloader from "services/utils/preloader.service";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Review.scss";

const Apps = () => {
	const [reviewData, setReviewData] = useState<IReview[]>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [readMoreBtn, setReadMOreBtn] = useState<boolean>(true);
	const [userReview, setUserReview] = useState([]);
	const [reviewProgress, setReviewProgress] = useState<any>();

	const { id } = useParams();

	useEffect(() => {
		// if (reviewData?.ratingStar) {
		// 	let tempData: any[] = [];
		// 	let tempSum = 0;
		// 	for (let i = 0; i < reviewData.ratingStar.length; i++) {
		// 		tempSum += reviewData.ratingStar[i];
		// 	}
		// 	for (let i = 0; i < reviewData.ratingStar.length; i++) {
		// 		tempData = [
		// 			{
		// 				star: i + 1,
		// 				review: reviewData.ratingStar[i],
		// 				progressWidth: (reviewData.ratingStar[i] * 100) / tempSum,
		// 			},
		// 			...tempData,
		// 		];
		// 	}
		// 	setReviewProgress(tempData);
		// }
		// if (reviewData?.userReview?.length) {
		// 	const userRev = [...reviewData?.userReview];
		// 	setUserReview(userRev.splice(0, 4));
		// }
		getReviews();
	}, []);

	const getReviews = () => {
		setIsLoading(true);
		ThemeService.getThemeReview({
			body: { themeId: id },
		})
			.then((resp) => setReviewData(resp.body))
			.finally(() => setIsLoading(false));
	};

	// const setReviewFun = () => {
	// 	const userRev = [...reviewData?.userReview];
	// 	if (reviewData?.userReview?.length >= userReview.length + 4) {
	// 		setUserReview(userRev.splice(0, userReview.length + 4));
	// 		return;
	// 	}
	// 	setUserReview(userRev.splice(0, reviewData?.userReview?.length));
	// };

	const showFullData = (tagId) => {
		document.getElementById(tagId).classList.remove("user_review_hide_msg");
		setReadMOreBtn(false);
	};

	if (isLoading) return <Preloader />;

	if (!reviewData)
		return <WxNotFound title="Oops!!!" description="Something went wrong." />;

	return (
		<div className="wx__review">
			{/* <div className="row wx__review_top">
				<div className="col-lg-6 col-md-12 col-sm-12 ">
					<h5 className="wx__text_semibold mb-3">Ratings</h5>
					<p className="wx__text_body wx__text_regular">
						Overall Rating &nbsp;&nbsp;
						<WxIcon className="small_icon" icon="star" variants="filled" />
						{reviewData.overallRating} ({reviewData.overallReview} Review)
					</p>
					<p className=" wx__text_regular w-100">
						**You must be logged in to submit a review.
					</p>
				</div>
				<div className="col-lg-6 col-md-12 col-sm-12 wx__mb-3">
					{reviewProgress?.map((item, index) => {
						return (
							<WxProgressBar
								key={index}
								star={item.star}
								progressWidth={item.progressWidth}
								review={item.review}
							/>
						);
					})}
				</div>
			</div> */}
			<div className="row wx__review_bottom">
				{reviewData?.length ? (
					<div className="wx__user_review pt-3">
						{/* <div className="d-flex wx__justify-content-between wx__align-items-center">
							<div className="d-flex wx__align-items-center w-100">
								<p className="wx__text_small wx__text_regular">
									Sort 73 Reviews By
								</p>
							</div>
							<div className="w-100 d-flex wx__justify-content-end wx__align-items-center">
								<WxButton variant="outline">Create Review</WxButton>
							</div>
						</div> */}
						<div>
							{reviewData?.map((item, index) => (
								<div key={item?.id} className="wx__single_review">
									<span className="wx__text_medium wx__text_strong">
										{item?.firstName} {item?.lastName}
									</span>
									<div className="d-flex align-items-center">
										<div>
											{Array(Math.round(item?.rating))
												.fill(null)
												.map((_, i) => (
													<WxIcon
														className="small_icon"
														icon="star"
														variants="filled"
													/>
												))}
										</div>
										{/* <p className="wx__text_body wx__text_regular wx__mb-0">
											{item.dateTime}
										</p> */}
									</div>
									<p
										className="w-100 wx__text_regular user_review_hide_msg"
										id={"user_review" + index}
									>
										{item.reviewMsg}
									</p>
									{readMoreBtn ? (
										<WxButton
											variant="none"
											size="sm"
											onClick={() => showFullData("user_review" + index)}
										>
											Read Full Review
										</WxButton>
									) : null}

									<div className="d-flex align-items-center">
										<div className="d-flex align-items-center helpful">
											<WxButton variant="none">
												<WxIcon
													className="icon "
													icon="thumb_up_off_alt"
													variants="round"
												/>
											</WxButton>
											<span>
												HELPFUL ({item?.reactionCountDTO?.[0]?.helpFull})
											</span>
										</div>
										<div className="d-flex align-items-center not-helpful">
											<WxButton variant="none">
												<WxIcon
													className="icon "
													icon="thumb_down"
													variants="outlined"
												/>
											</WxButton>
											<span>
												NOT HELPFUL ({item?.reactionCountDTO?.[0]?.notHelpFull})
											</span>
										</div>
									</div>
									{/* {item.reply?.map((reply, indx) => {
										return (
											<div className="wx__review_replay wx__mb-3" key={indx}>
												<p className="wx__text_medium">{reply.name}</p>
												<p className="wx__text_body wx__text_regular wx__mb-0">
													{reply.dateTime}
												</p>
												<p className="w-100 wx__text_regular">
													{reply.replyMsg}
												</p>
											</div>
										);
									})} */}
								</div>
							))}
						</div>
						{reviewData?.length ? (
							<div className="wx__mt-3">
								<WxButton variant="outline">Read More Reviews</WxButton>
							</div>
						) : null}
					</div>
				) : (
					<div className="wx__user_review_0 text-center">
						<WxIcon icon="vector" variants="filled" />
						<div>
							<WxIcon icon="star" variants="filled" />
							<WxIcon icon="star" variants="filled" />
							<WxIcon icon="star" variants="filled" />
						</div>
						<h3 className="wx__text_regular">No review found!</h3>
						<p className="wx__text_regular">
							You can write a review about your experience by using the write a
							review button.
						</p>
						<WxButton className="wx__m-auto" variant="fill">
							Create Review
						</WxButton>
					</div>
				)}
			</div>
		</div>
	);
};

export default Apps;
