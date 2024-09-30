import SomethingWrong from '@pages/errors/SomethingWrong';
import { Component, ReactNode } from 'react';

type ErrorBoundaryProps = {
	children: ReactNode;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <SomethingWrong />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
