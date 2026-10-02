import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import Swal from 'sweetalert2';
import { networkErrorVar } from '../../../apollo/client';
import { langVar, t } from '../../i18n';

const NetworkErrorToast = () => {
	const hasError = useReactiveVar(networkErrorVar);
	const lang = useReactiveVar(langVar);

	useEffect(() => {
		if (!hasError) return;

		Swal.fire({
			toast: true,
			position: 'top-end',
			icon: 'error',
			title: t('networkError', lang),
			showConfirmButton: false,
			timer: 4000,
			timerProgressBar: true,
		});

		networkErrorVar(false);
	}, [hasError, lang]);

	return null;
};

export default NetworkErrorToast;
