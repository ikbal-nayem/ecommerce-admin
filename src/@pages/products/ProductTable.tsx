import Icon from '@components/Icon';
import { Menu, MenuItem } from '@components/Menu';
import Thumbnail from '@components/Thumbnail';
import { IProductTable } from '@interfaces/product.interface';
import clsx from 'clsx';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCT_DETAILS } from 'routes/path-name.route';
import { imageURLGenerate } from 'utils/utils';

interface IProductTableProps {
	productsData?: any;
	handleDelete?: (item: any) => void;
}

const TableComponent = ({ productsData, handleDelete }: IProductTableProps) => {
	const onDelete = (item: any) => {
		handleDelete(item);
	};

	return (
		<div className='wx__responsive_table'>
			<table className='wx__table'>
				<thead className='wx__thead'>
					<tr className='wx__tr'>
						<th className='wx__th'>
							<div className='text_subtitle text_semibold'>Name</div>
						</th>
						<th className='wx__th'>
							<div className='text_subtitle text_semibold'>Category</div>
						</th>
						<th className='wx__th text-center'>
							<div className='text_subtitle text_semibold'>Status</div>
						</th>
						<th className='wx__th' />
					</tr>
				</thead>
				<tbody className='wx__tbody'>
					{productsData?.map((pd: IProductTable) => (
						<tr className='wx__tr' key={pd?._id}>
							<td className='wx__td'>
								<div className='wx__table_cell_avatar wx__product_name'>
									<Thumbnail name={pd?.name} src={imageURLGenerate(pd?.thumbnail || pd?.images)} />
									<div className='wx__table_cell_focus_text'>
										<Link to={PRODUCT_DETAILS({ product_id: pd?._id })}>{pd?.name}</Link>
									</div>
								</div>
							</td>
							<td className='wx__td'>{pd?.category.name || '---'}</td>
							<td className='wx__td text-center'>
								<div className={clsx('wx__btn_tags', { 'text-success': pd?.isActive })}>
									{pd?.isActive ? 'Published' : 'Inactive'}
								</div>
							</td>
							<td className='wx__td'>
								<div className='float-end'>
									<Menu triggerContent={<Icon icon='more_vert' />}>
										<MenuItem linkTo={PRODUCT_DETAILS({ product_id: pd._id })}>
											<Icon icon='edit' />
											<small>Edit</small>
										</MenuItem>
										<MenuItem className='text-danger' onClick={() => onDelete(pd)}>
											<Icon icon='delete' color='danger' />
											<small>Delete</small>
										</MenuItem>
									</Menu>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default memo(TableComponent);
