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
			className={`wx__list-group-item wx__d-flex wx__justify-content-between wx__align-items-center ${
				btn ? "list-group-item-action" : ""
			}`}
		>
			{children}
			<div className="wx__d-flex">
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
						className="material-icons wx__ms-1"
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
