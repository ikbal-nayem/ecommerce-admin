import Icon from '@components/Icon';
import WxDropdown from '@components/WxDropdown/WxDropdown';
import WxHr from '@components/WxHr';
import WxImg from '@components/WxImg/Img';
import { ENV } from 'config/ENV.config';
import { useAuth } from 'context/auth';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DASHBOARD, PORTAL_OVERVIEW } from 'routes/path-name.route';
import { imageURLGenerate } from 'utils/utils';
import './Header.scss';

const Header = ({ onClickFun, menuIconFlag, setMenuIconFlag }) => {
	const [menu, setMenu] = useState<boolean>(false);
	const { user_data } = useSelector((data: any) => data.user);
	const { logout } = useAuth();

	useEffect(() => {
		setMenu(false);
	}, []);

	const onClickMenuBar = () => {
		onClickFun();
		setMenuIconFlag(!menuIconFlag);
	};

	return (
		<div className='wx__header d-flex justify-content-between align-items-center'>
			<div className='menu_icon me-2' onClick={onClickMenuBar}>
				{menuIconFlag ? <Icon icon='close' /> : <Icon icon='menu' />}
			</div>
			<div className='wx__header__logo d-flex align-items-center'>
				<Link to={DASHBOARD}>
					<img src='/media/logos/shop-dark.png' alt='logo' width={40} />
					<span className='text_body text_medium ms-2'>
						<strong className='me-2'>Omuk Dokan</strong>
					</span>
				</Link>
			</div>
			<div className='wx__header__right__part d-flex align-items-center'>
				<div className='wx__avatar__img' onClick={() => setMenu(!menu)}>
					{user_data?.profile_img ? (
						<WxImg src={imageURLGenerate(user_data.profile_img)} alt='' />
					) : (
						<Icon icon='account_circle' size={30} />
					)}
				</div>
				<div>
					<span role='button' className='text_semibold topbar_user_name' onClick={() => setMenu(!menu)}>
						{user_data?.first_name
							? user_data?.first_name + ' ' + user_data?.last_name
							: user_data?.email || user_data?.role_name || 'My Account'}
					</span>

					<WxDropdown id='triggerPlace' isOpen={menu} setIsOpen={setMenu}>
						<ul>
							<li>
								<Link to='account-setting' className='text_body'>
									<Icon icon='person' variants='outlined' size={20} /> Manage Profile
								</Link>
							</li>
							<li>
								<a href={ENV.LandingPageURL + 'learning-center'} target='_blank' className='text_body'>
									<Icon icon='menu_book' variants='outlined' size={20} /> Learning Center
								</a>
							</li>
							<li>
								<Link to={PORTAL_OVERVIEW} className='text_body'>
									<Icon icon='group_work' variants='outlined' size={20} /> Partner Portal
								</Link>
							</li>
							<li>
								<WxHr />
							</li>
							<li>
								<a className='text_body' onClick={logout}>
									<Icon icon='wifi_protected_setup' variants='outlined' size={20} /> Log out
								</a>
							</li>
						</ul>
					</WxDropdown>
				</div>
			</div>
		</div>
	);
};

export default Header;
