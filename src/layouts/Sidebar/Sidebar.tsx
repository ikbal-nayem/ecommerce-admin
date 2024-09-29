import WxHr from '@components/WxHr';
import WxIcon from '@components/WxIcon/WxIcon';
import SidebarSkelton from '@components/WxSkelton/SidebarSkelton';
import { ENV } from 'config/ENV.config';
import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ONLINE_STORE, SETTINGS } from 'routes/path-name.route';
import nav_links from '../nav-links';

const Sidebar = ({ onClickFun }) => {
	const [open, setOpen] = useState('');
	const { pathname } = useLocation();

	const [loader, setLoader] = useState<boolean>(true);

	const onClickMenuItem = (link?: string, child?) => {
		if (link === '/online_store') {
			setOpen(link);
			return;
		}
		onClickFun(false);
		if (link === '-1') return;
		setOpen(link);
	};

	useEffect(() => {
		let tempNav = pathname?.split('/')?.[1];
		tempNav = '/' + tempNav;

		nav_links.forEach((item) => {
			if (item.link === tempNav) setOpen(tempNav);
		});

		setTimeout(() => {
			setLoader(false);
		}, 1000);
	}, []);

	const setActiveNav = (navLink) => {
		let tempNav = pathname?.split('/')?.[1];
		tempNav = '/' + tempNav;

		if (pathname === navLink.link || navLink.link === tempNav) {
			return true;
		}
		return false;
	};

	return (
		<>
			<div className='s-layout__sidebar'>
				<div className='side-menu-close' onClick={() => onClickMenuItem('-1')}></div>
				{!loader ? (
					<nav className='s-sidebar__nav wx_d-flex wx_flex-column wx_justify-content-between'>
						<ul className='sidebar_nav_list'>
							{nav_links.map((nav, i) => {
								return (
									<Fragment key={i}>
										{nav?.link === ONLINE_STORE ? (
											<li className=' wx__sales__channels hide__nav_text'>Sales Channels</li>
										) : null}
										<li
											className={`wx__single_side_nav_single_childrens   ${
												setActiveNav(nav) ? 'nav_active' : ''
											}`}
										>
											<Link
												className='s-sidebar__nav-link '
												to={nav?.childrens?.length && nav?.ownPage ? nav.childrens[0]?.link : nav.link}
												onClick={nav.link !== ONLINE_STORE ? () => onClickMenuItem(nav.link) : null}
											>
												<div
													className='wx__d-flex wx__justify-content-between wx__align-items-center'
													onClick={nav.link === ONLINE_STORE ? () => onClickMenuItem(nav.link) : null}
												>
													<WxIcon icon={nav.icon} />
													<span className='nav_link_text hide__nav_text'>{nav.label}</span>
												</div>
											</Link>
											{nav?.icon1 ? (
												<div className='view_website'>
													<WxIcon
														icon={nav.icon1}
														onClick={
															nav.link === ONLINE_STORE ? () => window.open(ENV.STORE_DOMAIN, '_blank') : null
														}
													/>
												</div>
											) : null}
										</li>
										{nav.childrens && (
											<ul
												className={` wx__single_side_nav_childrens medium_show ${
													open === nav.link ? 'wx__show_subChildrens' : ''
												}`}
											>
												{nav.childrens.map((child) => (
													<li
														className={`wx__single_side_nav_single_childrens ${
															pathname.includes(child.link) ? 'active' : ''
														}`}
														key={child.link}
													>
														<Link to={child.link} onClick={() => onClickMenuItem('-1')}>
															<span className='wx__side__childrens__text'>{child.label}</span>
														</Link>
													</li>
												))}
											</ul>
										)}
									</Fragment>
								);
							})}
							<li
								className={`show-mobile-view wx__single_side_nav_single_childrens ${
									pathname.match('/settings') ? 'nav_active' : ''
								}`}
							>
								<Link
									className='s-sidebar__nav-link'
									to={SETTINGS}
									onClick={() => onClickMenuItem(SETTINGS, '')}
								>
									<WxIcon icon='settings' />
									<span className='nav_link_text'>Settings</span>
								</Link>
							</li>
						</ul>
						<ul className='nav_bottom hide-mobile-view'>
							<WxHr />
							<li
								className={`wx__single_side_nav_single_childrens ${
									pathname.match('/settings') ? 'nav_active' : ''
								}`}
							>
								<Link
									className='s-sidebar__nav-link'
									to={SETTINGS}
									onClick={() => onClickMenuItem(SETTINGS, '')}
								>
									<WxIcon icon='settings' />
									<span className='nav_link_text'>Settings</span>
								</Link>
							</li>
						</ul>
					</nav>
				) : (
					<div
						style={{ width: '15rem', height: '100vh', marginTop: '53px' }}
						className='wx__bg-white sidebar-skelton'
					>
						<SidebarSkelton viewBox='0 0 240 900' />
					</div>
				)}
			</div>
		</>
	);
};

export default Sidebar;
