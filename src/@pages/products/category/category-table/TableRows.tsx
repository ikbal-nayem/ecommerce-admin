import Icon from '@components/Icon';
import { Menu, MenuItem } from '@components/Menu';
import { useState } from 'react';

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

	if (sub?.subcategories?.length) {
		return (
			<>
				<tr>
					<th className='wx__td'>
						<Icon icon='arrow_forward_ios' onClick={handleToggleSub} />
						<span className='material-icons inline left' role='button' style={{ paddingLeft: `${space}px` }}>
							{showSub ? 'remove_circle' : 'add_circle'}
						</span>
						<span>{sub.name}</span>
					</th>
					<td className='wx__td'>{sub.productCount}</td>
					<td className='wx__td'>
						<span
							className={`material-icons inline left ${!sub.isActive ? 'inactive' : ''}`}
							role='button'
							onClick={() => handleVisibility(sub)}
						>
							{sub.isActive ? 'remove_red_eye' : 'visibility_off'}
						</span>
					</td>
					<td className='wx__td more'>
						<Menu triggerContent={<Icon icon='more_vert' />}>
							<MenuItem onClick={onEdit}>
								<Icon icon='edit' />
								<small>Edit</small>
							</MenuItem>
							<MenuItem onClick={onAddSubcategory}>
								<Icon icon='add' />
								<small>Add Sub-category</small>
							</MenuItem>
							<MenuItem onClick={onDelete} className='text-danger'>
								<Icon icon='delete' color='danger' />
								<small>Delete</small>
							</MenuItem>
						</Menu>
					</td>
				</tr>
				{showSub ? (
					<TableItems
						data={sub?.subcategories}
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
			<th className='wx__td'>
				<Icon
					icon='arrow_forward_ios'
					onClick={handleToggleSub}
					style={{ opacity: '0.1', paddingLeft: `${space}px` }}
					size={15}
				/>
				{/* <span
					className='material-icons inline left'
					aria-disabled
					style={{ opacity: '0.1', paddingLeft: `${space}px` }}
				>
					add_circle
				</span> */}
				<span>{sub.name}</span>
			</th>
			<td className='wx__td'>{sub.productCount}</td>
			<td className='wx__td text-center'>
				<Icon
					icon={sub.isActive ? 'remove_red_eye' : 'visibility_off'}
					className={!sub.isActive ? 'inactive' : ''}
					onClick={() => handleVisibility(sub)}
				/>
				{/* <span
					className={`material-icons inline left ${!sub.isActive ? 'inactive' : ''}`}
					role='button'
					onClick={() => handleVisibility(sub)}
				>
					{sub.isActive ? 'remove_red_eye' : 'visibility_off'}
				</span> */}
			</td>
			<td className='wx__td'>
				<Menu triggerContent={<Icon icon='more_vert' />}>
					<MenuItem onClick={onEdit}>
						<Icon icon='edit' />
						<small>Edit</small>
					</MenuItem>
					<MenuItem onClick={onAddSubcategory}>
						<Icon icon='add' />
						<small>Add Sub-category</small>
					</MenuItem>
					<MenuItem onClick={onDelete} className='text-danger'>
						<Icon icon='delete' color='danger' />
						<small>Delete</small>
					</MenuItem>
				</Menu>
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
					key={sub.__id}
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
