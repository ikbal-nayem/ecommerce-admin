import { ToastComponent } from '@components/ToastComponent';
import App from 'App';
import 'assets/styles/main.scss';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from 'store/store';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={store}>
		<App />
		<ToastComponent />
	</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
