import Icon from "@components/Icon";
import {
	THEME_CUSTOMIZATION_GENERAL,
	THEME_CUSTOMIZATION_HOMEPAGE,
	THEME_CUSTOMIZATION_SOCIAL,
} from "routes/path-name.route";
import { Link } from "react-router-dom";
import './Sidebar.scss';


const Sidebar = () => {
    return (
        <div className="customizer-menu-section">
            <ul className="customizer-menu">
                <li>
                    <Link to={THEME_CUSTOMIZATION_GENERAL}>
                        <Icon icon='widgets' />
                        <span>General</span>
                    </Link>
                </li>
                <li>
                    <Link className="selected" to={THEME_CUSTOMIZATION_HOMEPAGE}>
                        <Icon icon='home' />
                        <span>Home Page</span>
                    </Link>
                </li>
                <li>
                    <Link to={THEME_CUSTOMIZATION_SOCIAL}>
                        <Icon icon='language' />
                        <span>Social Media</span>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar