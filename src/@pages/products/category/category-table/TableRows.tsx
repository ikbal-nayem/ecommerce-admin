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

	const handleToggleSub = () => setShowSub((prev) => !prev);

	const onDelete = () => {
		handleDelete(sub);
	};

	if (sub?.subcategories?.length) {
		return (
			<>
				<tr>
					<th className='wx__td'>
						<div className='d-flex align-items-center gap-2'>
							<Icon
								icon={showSub ? 'arrow_forward_ios' : 'arrow_forward_ios'}
								role='button'
								rotate={showSub ? 90 : 0}
								style={{ paddingLeft: `${space}px` }}
								onClick={handleToggleSub}
							/>
							<span>{sub.name}</span>
						</div>
					</th>
					<td className='wx__td text-center'>{sub.productCount}</td>
					<td className='wx__td text-center'>
						<Icon
							icon={sub.isActive ? 'remove_red_eye' : 'visibility_off'}
							color={sub.isActive ? 'primary' : 'danger'}
							size={20}
							role='button'
							className={!sub.isActive ? 'inactive' : ''}
							onClick={() => handleVisibility(sub)}
						/>
					</td>
					<td className='wx__td more'>
						<Menu triggerContent={<Icon icon='more_vert' />} position='end'>
							<MenuItem onClick={() => handleEdit(sub)}>
								<Icon icon='edit' />
								<small>Edit</small>
							</MenuItem>
							<MenuItem onClick={() => handleCreateSubcategory(sub)}>
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
				<div className='d-flex align-items-center gap-2'>
					<Icon
						icon='arrow_forward_ios'
						role='button'
						onClick={handleToggleSub}
						style={{ opacity: '0.1', paddingLeft: `${space}px` }}
					/>
					<span>{sub.name}</span>
				</div>
			</th>
			<td className='wx__td text-center'>{sub.productCount}</td>
			<td className='wx__td text-center'>
				<Icon
					icon={sub.isActive ? 'remove_red_eye' : 'visibility_off'}
					color={sub.isActive ? 'primary' : 'danger'}
					size={20}
					role='button'
					className={!sub.isActive ? 'inactive' : ''}
					onClick={() => handleVisibility(sub)}
				/>
			</td>
			<td className='wx__td'>
				<Menu triggerContent={<Icon icon='more_vert' />} position='end'>
					<MenuItem onClick={() => handleEdit(sub)}>
						<Icon icon='edit' />
						<small>Edit</small>
					</MenuItem>
					<MenuItem onClick={() => handleCreateSubcategory(sub)}>
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
