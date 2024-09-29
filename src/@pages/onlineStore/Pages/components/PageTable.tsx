import WxDropdown from '@components/WxDropdown/WxDropdown';
import WxIcon from '@components/WxIcon/WxIcon';
import WxTag from '@components/WxTag';
import { IPagesSettings } from '@interfaces/Settings.interface';
import { ENV } from 'config/ENV.config';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ONLINE_STORE_PAGES, PAGES_EDIT } from 'routes/path-name.route';

interface IPageTableProps {
	pages: IPagesSettings[];
	onDelete?: (page: IPagesSettings) => void;
}

const PageTable = ({ pages, onDelete }: IPageTableProps) => {
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

	return (
		<div className='wx__responsive_table'>
			<table className='wx__table'>
				<thead className='wx__thead'>
					<tr className='wx__tr'>
						<th className='wx__th'>Name</th>
						<th className='wx__th'>Slug</th>
						<th className='wx__th'>Status</th>
						<th className='wx__th'>View</th>
						<th className='wx__th' />
					</tr>
				</thead>
				<tbody className='wx__tbody'>
					{pages?.length &&
						pages?.map((p: IPagesSettings, index) => (
							<tr className='wx__tr' key={index}>
								<td className='wx__td'>
									<Link to={PAGES_EDIT({ id: p?.id })} className='wx__text_body hover-underline'>
										<strong>{p?.title}</strong>
									</Link>
								</td>
								<td className='wx__td'>{p?.slug}</td>
								<td className='wx__td'>
									{p?.isActive ? <WxTag label='Published' color='success' /> : <WxTag label='Unpublished' />}
								</td>
								<td className='wx__td' width={80}>
									<WxIcon
										icon='visibility'
										onClick={() =>
											window.open(
												`${ENV.STORE_DOMAIN?.split('/admin')?.[0]}${ONLINE_STORE_PAGES({ slug: p?.slug })}`
											)
										}
									/>
								</td>
								<td className='wx__td text-center' width={80}>
									<div className='wx__table_cell_more-icon'>
										<WxIcon icon='more_vert' onClick={() => onShowPopup(index)} id='triggerId' />
										{selectedIndex === index && (
											<WxDropdown isOpen={showPopup} setIsOpen={setShowPopup} drop>
												<ul>
													<li className='wx__text_subtitle'>
														<Link to={PAGES_EDIT({ id: p?.id })} className='wx__text_body'>
															<WxIcon icon='edit' />
															Edit
														</Link>
													</li>
													<li className='wx__text_subtitle delete'>
														<a className='wx__text_body' onClick={() => onDelete(p)}>
															<WxIcon icon='delete' />
															Delete
														</a>
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

export default PageTable;
