import Link from 'next/link';
import Image from 'next/image';
import { useReactiveVar } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { langVar, t } from '../../i18n';

const Footer = () => {
	const device = useDeviceDetect();
	const lang = useReactiveVar(langVar);

	const logoWidth = device === 'mobile' ? 100 : 120;
	const logoHeight = device === 'mobile' ? 50 : 60;

	return (
		<footer>
			<div className="container">
				<div className="footer-grid">
					<div className="footer-brand">
						<Image src="/mrhalal_logo_v3.svg" width={logoWidth} height={logoHeight} alt="Mr. Halal" />
						<p className="footer-tagline">{t('tagline', lang)}</p>
					</div>

					<div className="footer-contact">
						<p>Tel: 877-3009</p>
						<p>Email: info@mrhalal.kr</p>
					</div>

					<div className="footer-social">
						<Link href="#">{t('instagram', lang)}</Link>
						<Link href="#">{t('telegram', lang)}</Link>
					</div>
				</div>

				<div className="footer-bottom">
					<p>{t('copyright', lang)}</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
