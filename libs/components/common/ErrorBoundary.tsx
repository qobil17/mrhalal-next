import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error('[ErrorBoundary]', error, info.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="app-crash-fallback">
					<span>😕</span>
					<h2>Nimadir xato ketdi</h2>
					<p>Sahifani qayta yuklab ko&apos;ring.</p>
					<button type="button" onClick={() => window.location.reload()}>
						Qayta yuklash
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
