import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/Icon";
import Switch from "@components/Switch";
import { ICustomerPayload } from "@interfaces/Customer.interface";
import { CUSTOMERS } from "routes/path-name.route";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ICustomerTableProps {
  customers: ICustomerPayload[];
  onChangeStatus: (index: number, customerId: string, status: string) => void;
  onEdit?: (customerId: string) => void;
  onDelete?: (customer: string) => void;
}

const CustomerTable = ({
  customers,
  onChangeStatus,
  onEdit,
  onDelete,
}: ICustomerTableProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const onShowPopup = (index: number) => {
    // a trigger id is need to show the popup
    if (selectedIndex === index) {
      setSelectedIndex(0);
      setShowPopup(!showPopup);
      return;
    }
    setSelectedIndex(index);
    setShowPopup(!showPopup);
  };

  return (
		<div className="wx__responsive_table">
			<table className="wx__table">
				<thead className="wx__thead">
					<tr className="wx__tr">
						<th className="wx__th">Name</th>
						<th className="wx__th">Mobile</th>
						<th className="wx__th">Email</th>
						<th className="wx__th">Customer Group</th>
						<th className="wx__th">Status</th>
						<th className="wx__th"></th>
					</tr>
				</thead>
				<tbody className="wx__tbody">
					{customers?.length > 0 &&
						customers.map((customer: any, index) => (
							<tr className="wx__tr" key={index}>
								<td className="wx__td">
									<strong>
										<Link
											to={`${CUSTOMERS}/${customer?.customerId}`}
											className="hover-underline"
										>
											{customer?.firstName + " " + customer?.lastName || "---"}
										</Link>
									</strong>
								</td>
								<td className="wx__td">{customer?.phoneNumber || "---"}</td>
								<td className="wx__td">{customer?.email || "---"}</td>
								<td className="wx__td">{customer?.groupName || "---"}</td>
								<td className="wx__td">
									<div className="wx__table_cell_icon">
										<Switch
											checkedTitle="Active"
											unCheckedTitle="Inactive"
											// defaultChecked={
											//   customer?.customer?.status === "Active" ? true : false
											// }
											isChecked={customer?.status === "Active"}
											onChange={(e: any) => {
												onChangeStatus(
													index,
													customer.customerId,
													e.target.checked
												);
											}}
										/>
									</div>
								</td>
								<td className="wx__td text-center">
									<div className="wx__table_cell_more-icon ms_2">
										<WxIcon
											icon="more_vert"
											onClick={() => onShowPopup(index)}
											id="triggerId"
										/>
										{selectedIndex === index && (
											<WxDropdown
												isOpen={showPopup}
												setIsOpen={setShowPopup}
												drop
											>
												<ul>
													<li className="text_subtitle">
														<Link
															to={`${CUSTOMERS}/${customer.customerId}`}
															className="text_body"
														>
															<WxIcon icon="info" />
															Details
														</Link>
													</li>
													<li className="text_subtitle">
														<Link
															to={`${CUSTOMERS}/${customer.customerId}`}
															className="text_body"
														>
															<WxIcon icon="edit" />
															Edit
														</Link>
													</li>
													<li className="text_subtitle delete">
														<Link
															to=""
															className="text_body"
															onClick={() => onDelete(customer)}
														>
															<WxIcon icon="delete" />
															Delete
														</Link>
													</li>
												</ul>
											</WxDropdown>
										)}
									</div>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default CustomerTable;
