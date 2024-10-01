import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxTag from "@components/WxTag";
import { IOrderTimeline } from "@interfaces/order.interface";
import { OrderService } from "services/api/Order.service";
import { ToastService } from "services/utils/toastr.service";
import { memo, useRef, useState } from "react";
import { generateDateFormat } from "utils/splitDate";

type OrderTimelineProps = {
	orderTimeline: IOrderTimeline[];
	onApprove?: (data: IOrderTimeline) => void;
	onReject: () => void;
};

const OrderTimeline = ({
	orderTimeline,
	onApprove,
	onReject,
}: OrderTimelineProps) => {
	const [isSubmitting, setSubmitting] = useState<boolean>(false);
	const [rejectModal, setRejectedModal] = useState<boolean>(false);
	const rejectData = useRef<IOrderTimeline>();

	const onRejectPayment = (data: IOrderTimeline) => {
		rejectData.current = data;
		setRejectedModal(true);
	};

	const onRejectConfirm = () => {
		setSubmitting(true);
		OrderService.changePaymentStatus({
			id: rejectData.current?.id,
			isApprove: false,
		})
			.then((resp) => {
				ToastService.success(resp?.message);
				onReject();
				setRejectedModal(false);
			})
			.catch((err) => ToastService.error(err?.message))
			.finally(() => setSubmitting(false));
	};

	orderTimeline?.sort((p, c) => c.time - p.time);

	return (
		<>
			<div className="card wx__mt-3 wx__p-3">
				<h6 className="wx__text_h6 wx__text_semibold">Timeline</h6>
				<div className="wx__timeline">
					<div className="events">
						{orderTimeline?.map((event: IOrderTimeline) => (
							<div className="event" key={event?.id}>
								<div className="dot parent-dot" />
								<div className="wx__text_body wx__text_medium">
									{event?.description} <br />
									<small className="wx__text_regular wx__text_small wx__text-muted">
										{generateDateFormat(
											event?.time,
											"%date%-%MM%-%yyyy% %hour%:%minute% %ampm%"
										)}
									</small>
									{event?.canAppove ? (
										<div className="d-flex gap-2 wx__mt-1">
											<WxTag
												label="Approve"
												color="success"
												onClick={() => onApprove(event)}
											/>
											<WxTag
												label="Reject"
												color="danger"
												onClick={() => onRejectPayment(event)}
											/>
										</div>
									) : null}
								</div>
							</div>
						))}
						<div className="line" />
					</div>
				</div>
			</div>
			<ConfirmationModal
				isOpen={rejectModal}
				onClose={() => setRejectedModal(false)}
				onConfirm={onRejectConfirm}
				isSubmitting={isSubmitting}
				onConfirmLabel="Yes Reject"
				title="Reject confirmation!"
				body="Do you really want to reject the payment request? You can not undo this action."
			/>
		</>
	);
};

export default memo(OrderTimeline);
