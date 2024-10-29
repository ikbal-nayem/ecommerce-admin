import { IconButton } from '@components/Button';
import Thumbnail from '@components/Thumbnail';
import Tag from '@components/WxTag';
import { genetartMediaURL } from 'utils/utils';

type CollectionTableProps = {
	data?: any[];
	handleEdit?: Function;
	onDelete?: Function;
	handleVisibility?: Function;
};

const CollectionTable = ({ data, handleEdit, onDelete }: CollectionTableProps) => {
	return (
		<table className='collection_table'>
			<thead>
				<tr>
					<th className='w-100 text-muted'>Image, Collection Name</th>
					<th className='text-muted' colSpan={2}>Status</th>
				</tr>
			</thead>
			<tbody>
				{data.map((sub) => (
					<tr key={sub._id}>
						<td className='d-flex align-items-center gap-3'>
							<Thumbnail name={sub.name} src={genetartMediaURL(sub?.image)} />
							<strong>{sub.name}</strong>
						</td>
						<td>
							<Tag color={sub.isActive ? 'success' : 'danger'} label={sub.isActive ? 'Visible' : 'Hidden'} />
						</td>
						<td className='text-end'>
							<div className='d-inline-flex gap-2'>
								<IconButton iconName='edit' iconColor='primary' onClick={() => handleEdit(sub)} />
								<IconButton iconName='delete' iconColor='danger' onClick={() => onDelete(sub)} />
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default CollectionTable;
