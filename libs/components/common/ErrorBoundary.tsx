import { Component, type ErrorInfo, type ReactNode } from 'react';
import { langVar, t } from '../../i18n';

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
			// Class component, so read the reactive var directly instead of useReactiveVar.
			const lang = langVar();

			return (
				<div className="app-crash-fallback">
					<span>😕</span>
					<h2>{t('crashTitle', lang)}</h2>
					<p>{t('crashText', lang)}</p>
					<button type="button" onClick={() => window.location.reload()}>
						{t('reloadButton', lang)}
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
