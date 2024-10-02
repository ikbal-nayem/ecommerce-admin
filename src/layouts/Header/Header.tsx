import WxDropdown from '@components/WxDropdown/WxDropdown';
import WxHr from '@components/WxHr';
import WxIcon from '@components/WxIcon/WxIcon';
import WxImg from '@components/WxImg/WxImg';
import WxTag from '@components/WxTag';
import { ROUTES } from '@constants/route.constant';
import { ENV } from 'config/ENV.config';
import { useAuth } from 'context/auth';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PORTAL_OVERVIEW } from 'routes/path-name.route';
import { statusColorMapping } from 'utils/colorMap';
import { imageURLGenerate } from 'utils/utils';
import './Header.scss';

const Header = ({ onClickFun, menuIconFlag, setMenuIconFlag }) => {
	const [menu, setMenu] = useState<boolean>(false);
	const { user_data, activePlan } = useSelector((data: any) => data.user);
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
				{menuIconFlag ? <WxIcon icon='close' /> : <WxIcon icon='menu' />}
			</div>
			<div className='wx__header__logo d-flex align-items-center'>
				<Link to={ROUTES.DASHBOARD}>
					<img src='/media/logos/shop-dark.png' alt='logo' width={40} />
					<span className='text_body text_medium ms-2'>
						<strong className='me-2'>Omuk Dokan</strong>
						<WxTag label={activePlan?.title} color={statusColorMapping(activePlan?.title)} />
					</span>
				</Link>
			</div>
			<div className='wx__header__right__part d-flex align-items-center'>
				<div className='wx__avatar__img' onClick={() => setMenu(!menu)}>
					{user_data?.profile_img ? (
						<WxImg src={imageURLGenerate(user_data.profile_img)} alt='' />
					) : (
						<WxIcon icon='account_circle' size={30} />
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
									<WxIcon icon='person' variants='outlined' size={20} /> Manage Profile
								</Link>
							</li>
							<li>
								<a href={ENV.LandingPageURL + 'learning-center'} target='_blank' className='text_body'>
									<WxIcon icon='menu_book' variants='outlined' size={20} /> Learning Center
								</a>
							</li>
							<li>
								<Link to={PORTAL_OVERVIEW} className='text_body'>
									<WxIcon icon='group_work' variants='outlined' size={20} /> Partner Portal
								</Link>
							</li>
							<li>
								<WxHr />
							</li>
							<li>
								<a className='text_body' onClick={logout}>
									<WxIcon icon='wifi_protected_setup' variants='outlined' size={20} /> Log out
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
