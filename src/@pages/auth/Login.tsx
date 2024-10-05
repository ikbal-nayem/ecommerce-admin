import { ROUTES } from '@constants/route.constant';
import clsx from 'clsx';
import { useAuth } from 'context/auth';
import useLoader from 'hooks/useLoader';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthService } from 'services/api/Auth.service';
import { ToastService } from 'services/utils/toastr.service';
import './login.scss';

const Login = () => {
	const [loading, setLoading] = useLoader(false, true);
	const { makeAuthenticate } = useAuth();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm();

	const onSubmit = (data) => {
		setLoading(true);
		AuthService.login(data)
			.then((res) => {
				makeAuthenticate(res?.token, res?.data);
				navigate(ROUTES.DASHBOARD);
			})
			.catch((err) => {
				ToastService.error(err?.message);
				setError('email', { message: err?.message, type: 'manual' });
				setError('password', { message: err?.message, type: 'manual' });
			})
			.finally(() => setLoading(false));
	};

	return (
		<div className='auth-container'>
			<div className='login-content rounded-4 overflow-hidden'>
				<div className='left-image d-none d-sm-block'></div>
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<h4>Welcome back!</h4>
					<p>Log in to your account to view today's clients:</p>
					<div className='floating-label'>
						<input
							placeholder='Email'
							type='email'
							className={clsx({ 'input-error': errors.email })}
							name='email'
							disabled={loading}
							{...register('email', { required: true })}
						/>
						<label htmlFor='email'>Email:</label>
						<div className='icon'>
							<span className='material-icons-outlined'>alternate_email</span>
						</div>
					</div>
					<div className='floating-label'>
						<input
							placeholder='Password'
							type='password'
							name='password'
							disabled={loading}
							className={clsx({ 'input-error': errors.email })}
							{...register('password', { required: true })}
						/>
						<label htmlFor='password'>Password:</label>
						<div className='icon'>
							<span className='material-icons-outlined'>key</span>
						</div>
					</div>
					<button type='submit' disabled={loading}>
						Log in
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
