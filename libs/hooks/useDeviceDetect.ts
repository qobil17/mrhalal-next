import { useEffect, useState } from 'react';

const MOBILE_MAX_WIDTH = 768;

const useDeviceDetect = (): 'mobile' | 'desktop' => {
	const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');

	useEffect(() => {
		// Viewport width is the source of truth, not the User-Agent string - UA
		// sniffing alone misses cases like DevTools "Responsive" mode without a
		// device preset, in-app browsers, or WebViews that report a desktop UA
		// at a narrow viewport. That mismatch previously rendered the desktop
		// navbar (with no responsive handling at all) at phone widths, causing
		// it to overflow horizontally.
		const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);

		const update = () => {
			setDevice(mediaQuery.matches ? 'mobile' : 'desktop');
		};

		update();
		mediaQuery.addEventListener('change', update);

		return () => mediaQuery.removeEventListener('change', update);
	}, []);

	return device;
};

export default useDeviceDetect;
