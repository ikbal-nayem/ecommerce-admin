import Icon from '@components/Icon';
import { Menu, MenuItem } from '@components/Menu';
import Thumbnail from '@components/Thumbnail';
import WxTag from '@components/WxTag';
import { IProductTable } from '@interfaces/product.interface';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCT_DETAILS } from 'routes/path-name.route';
import { genetartMediaURL } from 'utils/utils';

interface IProductTableProps {
	productsData?: any;
	handleDelete?: (item: any) => void;
}

const TableComponent = ({ productsData, handleDelete }: IProductTableProps) => {
	return (
		<div className='wx__responsive_table'>
			<table className='wx__table'>
				<thead className='wx__thead'>
					<tr className='wx__tr'>
						<th className='wx__th'>
							<div className='text-muted fw-bolder'>Name</div>
						</th>
						<th className='wx__th'>
							<div className='text-muted fw-bolder'>Category</div>
						</th>
						<th className='wx__th text-center'>
							<div className='text-muted fw-bolder'>Status</div>
						</th>
					</tr>
				</thead>
				<tbody className='wx__tbody'>
					{productsData?.map((pd: IProductTable) => (
						<tr className='wx__tr' key={pd?._id}>
							<td className='wx__td'>
								<div className='wx__table_cell_avatar wx__product_name'>
									<Thumbnail name={pd?.name} src={genetartMediaURL(pd?.images?.[0])} />
									<div className='wx__table_cell_focus_text'>
										<Link to={PRODUCT_DETAILS({ product_id: pd?._id })}>{pd?.name}</Link>
									</div>
								</div>
							</td>
							<td className='wx__td'>{pd?.category.name || '---'}</td>
							<td className='wx__td text-center'>
								<WxTag
									label={pd?.isActive ? 'Published' : 'Inactive'}
									color={pd?.isActive ? 'success' : 'danger'}
								/>
							</td>
							<td className='wx__td'>
								<div className='float-end'>
									<Menu triggerContent={<Icon icon='more_vert' />}>
										<MenuItem linkTo={PRODUCT_DETAILS({ product_id: pd._id })}>
											<Icon icon='edit' />
											<small>Edit</small>
										</MenuItem>
										<MenuItem className='text-danger' onClick={() => handleDelete(pd)}>
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
