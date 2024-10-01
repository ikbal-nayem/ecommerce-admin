type WxListItemProps = {
	children?: JSX.Element | JSX.Element[] | string;
	btn?: boolean;
	onEdit?: Function;
	onDelete?: Function;
};

const WxListItem = ({ children, btn, onEdit, onDelete }: WxListItemProps) => {
	return (
		<li
			role={btn ? "button" : "none"}
			className={`form_group-item d-flex justify-content-between align-items-center ${
				btn ? "list-group-item-action" : ""
			}`}
		>
			{children}
			<div className="d-flex">
				{onEdit ? (
					<span
						className="material-icons"
						role="button"
						onClick={() => onEdit()}
					>
						edit
					</span>
				) : null}
				{onDelete ? (
					<span
						className="material-icons ms-1"
						role="button"
						onClick={() => onDelete()}
					>
						delete
					</span>
				) : null}
			</div>
		</li>
	);
};

export default WxListItem;
