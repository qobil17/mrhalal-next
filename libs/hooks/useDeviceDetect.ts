import { useEffect, useState } from 'react';

const useDeviceDetect = (): 'mobile' | 'desktop' => {
	const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');

	useEffect(() => {
		const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setDevice(isMobile ? 'mobile' : 'desktop');
	}, []);

	return device;
};

export default useDeviceDetect;
