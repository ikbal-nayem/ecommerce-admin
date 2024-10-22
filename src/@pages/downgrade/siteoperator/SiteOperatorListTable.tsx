import Icon from "@components/Icon";
import { ISiteOperator } from "@interfaces/Settings.interface";
import { useState } from "react";
import "./SiteOperator.scss";

interface ISiteOperatorTable {
	siteOperatorData: ISiteOperator[];
	onDelete: (operator: ISiteOperator) => void;
}

const SiteOperatorListTable = ({
	siteOperatorData,
	onDelete,
}: ISiteOperatorTable) => {
	return (
		<div className="wx__responsive_table wx__table_noPopup">
			<table className="wx__table site_operator_table">
				<thead className="wx__thead">
					<tr className="wx__tr">
						<th className="wx__th">Role name</th>
						<th className="wx__th">Name</th>
						<th className="wx__th">Email</th>
						<th className="wx__th">Phone</th>
						<th className="wx__th text-end">Action</th>
					</tr>
				</thead>
				<tbody className="wx__tbody">
					{siteOperatorData?.map((operator: any, index: number) => (
						<tr className="wx__tr" key={operator?.id || index}>
							<td className="wx__td">{operator?.roleName}</td>
							<td className="wx__td">{operator?.name}</td>
							<td className="wx__td">{operator?.email || "---"}</td>
							<td className="wx__td">{operator?.phone || "---"}</td>
							<td className="wx__td" align="right">
								<Icon
									variants="outlined"
									icon="delete"
									onClick={() => onDelete(operator)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default SiteOperatorListTable;
