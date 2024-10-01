import Router from 'routes/index';
import AuthProvider from 'context/auth';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
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
