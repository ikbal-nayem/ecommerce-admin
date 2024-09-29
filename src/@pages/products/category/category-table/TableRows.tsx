import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/WxIcon/WxIcon";
import { useState } from "react";

type ItemsProps = {
  data?: any[];
  sub?: any;
  space?: number;
  handleEdit?: Function;
  handleVisibility?: Function;
  handleDelete?: Function;
  handleCreateSubcategory?: Function;
};

const TableSubItem = ({
  sub,
  space = 0,
  handleEdit,
  handleVisibility,
  handleDelete,
  handleCreateSubcategory,
}: ItemsProps) => {
  const [showSub, setShowSub] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handleToggleSub = () => setShowSub((prev) => !prev);

  const onEdit = () => {
    setShowPopup(false);
    handleEdit(sub);
  };

  const onAddSubcategory = () => {
    setShowPopup(false);
    handleCreateSubcategory(sub);
  };

  const onDelete = () => {
    setShowPopup(false);
    handleDelete(sub);
  };

  if (sub.children.length) {
		return (
			<>
				<tr>
					<th className="wx__td">
						<span
							className="material-icons inline left"
							role="button"
							style={{ paddingLeft: `${space}px` }}
							onClick={handleToggleSub}
						>
							{showSub ? "remove_circle" : "add_circle"}
						</span>
						<span>{sub.name}</span>
					</th>
					<td className="wx__td">{sub.productCount}</td>
					<td className="wx__td">
						<span
							className={`material-icons inline left ${
								!sub.isActive ? "inactive" : ""
							}`}
							role="button"
							onClick={() => handleVisibility(sub)}
						>
							{sub.isActive ? "remove_red_eye" : "visibility_off"}
						</span>
					</td>
					<td className="wx__td more">
						<WxIcon
							icon="more_vert"
							className="inline left"
							onClick={() => setShowPopup(true)}
						/>

						<WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
							<ul>
								<li className="wx__text_subtitle">
									<a className="wx__text_body" onClick={onEdit}>
										<WxIcon icon="edit" />
										Edit
									</a>
								</li>
								<li className="wx__text_subtitle">
									<a className="wx__text_body" onClick={onAddSubcategory}>
										<WxIcon icon="add" />
										Add Subcategory
									</a>
								</li>
								<li className="wx__text_subtitle">
									<a
										className="wx__text_body wx__text-danger"
										onClick={onDelete}
									>
										<WxIcon icon="delete" color="danger" />
										Delete
									</a>
								</li>
							</ul>
						</WxDropdown>
					</td>
				</tr>
				{showSub ? (
					<TableItems
						data={sub.children}
						space={space + 24}
						handleEdit={handleEdit}
						handleVisibility={handleVisibility}
						handleDelete={handleDelete}
						handleCreateSubcategory={handleCreateSubcategory}
					/>
				) : null}
			</>
		);
	}

	return (
		<tr>
			<th className="wx__td">
				<span
					className="material-icons inline left"
					aria-disabled
					style={{ opacity: "0.1", paddingLeft: `${space}px` }}
				>
					add_circle
				</span>
				<span>{sub.name}</span>
			</th>
			<td className="wx__td">{sub.productCount}</td>
			<td className="wx__td">
				<span
					className={`material-icons inline left ${
						!sub.isActive ? "inactive" : ""
					}`}
					role="button"
					onClick={() => handleVisibility(sub)}
				>
					{sub.isActive ? "remove_red_eye" : "visibility_off"}
				</span>
			</td>
			<td className="wx__td more">
				<WxIcon
					icon="more_vert"
					className="inline left"
					onClick={() => setShowPopup(true)}
				/>
				<WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
					<ul>
						<li className="wx__text_subtitle">
							<a className="wx__text_body" onClick={onEdit}>
								<WxIcon icon="edit" />
								<small>Edit</small>
							</a>
						</li>
						<li className="wx__text_subtitle">
							<a className="wx__text_body" onClick={onAddSubcategory}>
								<WxIcon icon="add" />
								<small>Add Sub-category</small>
							</a>
						</li>
						<li className="wx__text_subtitle">
							<a className="wx__text_body wx__text-danger" onClick={onDelete}>
								<WxIcon icon="delete" color="danger" />
								<small>Delete</small>
							</a>
						</li>
					</ul>
				</WxDropdown>
			</td>
		</tr>
	);
};

const TableItems = ({
  data,
  space = 0,
  handleEdit,
  handleVisibility,
  handleDelete,
  handleCreateSubcategory,
}: ItemsProps) => {
  return (
    <>
      {data?.map((sub) => (
        <TableSubItem
          key={sub.id}
          sub={sub}
          space={space}
          handleEdit={handleEdit}
          handleVisibility={handleVisibility}
          handleDelete={handleDelete}
          handleCreateSubcategory={handleCreateSubcategory}
        />
      ))}
    </>
  );
};

export default TableItems;
