import { IconButton } from '@components/Button';
import Thumbnail from '@components/Thumbnail';
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
					<th colSpan={2}>Collection Name</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{data.map((sub) => (
					<tr key={sub._id}>
						<td className='collection_image'>
							<Thumbnail name={sub.name} src={genetartMediaURL(sub?.image)} />
						</td>
						<th>
							<span>{sub.name}</span>
						</th>
						<td className='more'>
							<div className='d-flex gap-2'>
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
