import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import Swal from 'sweetalert2';
import { networkErrorVar } from '../../../apollo/client';

const NetworkErrorToast = () => {
	const message = useReactiveVar(networkErrorVar);

	useEffect(() => {
		if (!message) return;

		Swal.fire({
			toast: true,
			position: 'top-end',
			icon: 'error',
			title: message,
			showConfirmButton: false,
			timer: 4000,
			timerProgressBar: true,
		});

		networkErrorVar(null);
	}, [message]);

	return null;
};

export default NetworkErrorToast;
