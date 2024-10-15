import AuthProvider from 'context/auth';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from 'routes/index';
import { CommonService } from 'services/api/common.service';

const App = () => {
	useEffect(() => {
		setInterval(() => {
			CommonService.ping();
		}, 600000);
	}, []);

	return (
		<div>
			<BrowserRouter>
				<AuthProvider>
					<Router />
				</AuthProvider>
			</BrowserRouter>
		</div>
	);
};

export default App;
