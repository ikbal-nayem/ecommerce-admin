import '@components/WxDropdown/WxDropdown.scss';
import Router from 'routes/index';
import 'assets/style.scss';
import AuthProvider from 'context/auth';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
	return (
		<div id='wxRoot' style={{ minHeight: '100vh', height: '100%' }}>
			<BrowserRouter>
				<AuthProvider>
					<Router />
				</AuthProvider>
			</BrowserRouter>
		</div>
	);
};

export default App;
