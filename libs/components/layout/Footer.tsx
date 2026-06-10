import Link from 'next/link';
import Image from 'next/image';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Footer = () => {
	const device = useDeviceDetect();

	const logoWidth = device === 'mobile' ? 100 : 120;
	const logoHeight = device === 'mobile' ? 50 : 60;

	return (
		<footer>
			<div className="footer-grid">
				<div className="footer-brand">
					<Image src="/logo.png" width={logoWidth} height={logoHeight} alt="Mr. Halal" />
					<p>Koreyadagi halol go&apos;sht do&apos;koni</p>
				</div>

				<div className="footer-contact">
					<p>Tel: 877-3009</p>
					<p>Email: info@mrhalal.kr</p>
				</div>

				<div className="footer-social">
					<Link href="#">Instagram</Link>
					<Link href="#">Telegram</Link>
				</div>
			</div>

			<div className="footer-bottom">
				<p>© 2024 Mr. Halal. All rights reserved.</p>
			</div>
		</footer>
	);
};

export default Footer;
