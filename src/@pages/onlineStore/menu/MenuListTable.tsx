import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/Icon";
import WxSwitch from "@components/WxSwitch";
import { ROLE_KEY } from "config/constants";
import { MENU_EDIT } from "routes/path-name.route";
import { useState } from "react";
import { Link } from "react-router-dom";

interface IMenuSetTable {
  menuSetData: any[];
  onDelete: (customerId: string) => void;
  onChangeStatus: (value: any, index: number, status) => void;
}

const MenuListTable = ({
  menuSetData,
  onDelete,
  onChangeStatus,
}: IMenuSetTable) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const onShowPopup = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(0);
      setShowPopup(!showPopup);
      return;
    }
    setSelectedIndex(index);
    setShowPopup(!showPopup);
  };
  const deleteFun = (coupon) => {
    setShowPopup(!showPopup);
    onDelete(coupon);
  };

  return (
		<table className="wx__table site_operator_table">
			<thead className="wx__thead">
				<tr className="wx__tr">
					<th className="wx__th">Name</th>
					<th className="wx__th">Status</th>
					<th />
				</tr>
			</thead>
			<tbody className="wx__tbody">
				{menuSetData?.map((menuItem: any, index: number) => (
					<tr className="wx__tr" key={menuItem?.id || index}>
						<td className="wx__td">
							<Link
								className="hover-underline"
								to={MENU_EDIT({
									id: menuItem.id,
								})}
							>
								{menuItem?.name || "---"}
							</Link>
						</td>
						<td className="wx__td">
							<WxSwitch
								checkedTitle="Active"
								unCheckedTitle="Inactive"
								isChecked={menuItem?.isActive || menuItem?.isActive === null}
								disabled={menuItem?.roleCode === ROLE_KEY.MERCHANT}
								onChange={(e: any) => {
									onChangeStatus(menuItem, index, e.target.checked);
								}}
							/>
						</td>
						<td className="wx__td" width={50}>
							<div className="wx__table_cell_more-icon">
								<WxIcon
									role="button"
									icon="more_vert"
									id="triggerId"
									onClick={() => {
										menuItem?.roleCode !== ROLE_KEY.MERCHANT &&
											onShowPopup(index);
									}}
								/>
								{selectedIndex === index && (
									<WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
										<ul>
											{/* TODO:: li margin and padding is not set yet */}
											<li className="text_subtitle">
												<Link
													to={MENU_EDIT({
														id: menuItem.id,
													})}
													className="text_body"
												>
													<WxIcon icon="edit" />
													Edit
												</Link>
											</li>
											{menuItem?.isDefault ? null : (
												<li className="text_subtitle delete">
													<Link
														to=""
														className="text_body"
														onClick={() => deleteFun(menuItem)}
													>
														<WxIcon icon="delete" />
														Delete
													</Link>
												</li>
											)}
										</ul>
									</WxDropdown>
								)}
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default MenuListTable;
