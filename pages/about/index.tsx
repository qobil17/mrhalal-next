import type { NextPage } from 'next';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';

const AboutPage: NextPage = () => {
	return (
		<>
			{/* Hero */}
			<div className="about-hero">
				<div className="container">
					<h1>Mr. Halal haqida</h1>
					<p>Koreyadagi eng ishonchli halol go&apos;sht do&apos;koni</p>
				</div>
			</div>

			{/* About us */}
			<div className="frame-wrap">
				<div className="container">
					<div className="about-section">
						<div className="about-text">
							<h2>Bizning haqimizda</h2>
							<p>
								Mr. Halal — 2015-yildan buyon Koreya musulmonlariga toza va sertifikatlangan halol mahsulotlar
								yetkazib kelmoqda. Biz beef, lamb va chicken mahsulotlarini to&apos;g&apos;ridan-to&apos;g&apos;ri
								ishonchli ta&apos;minotchilardan olib, mijozlarimizga eng yuqori sifatda taqdim etamiz.
							</p>
							<p>
								Bizning missiyamiz — Koreyada yashovchi musulmon hamjamiyatiga qulay va ishonchli halol oziq-ovqat
								xizmatini ko&apos;rsatish.
							</p>
							<div className="about-stats">
								<div className="about-stat">
									<strong>2015</strong>
									<span>Tashkil etilgan yil</span>
								</div>
								<div className="about-stat">
									<strong>500+</strong>
									<span>Doimiy mijozlar</span>
								</div>
								<div className="about-stat">
									<strong>50+</strong>
									<span>Mahsulot turlari</span>
								</div>
							</div>
						</div>
						<div className="about-image">
							<div className="about-logo-big">🕌</div>
						</div>
					</div>
				</div>
			</div>

			{/* Halal certificate */}
			<div className="frame-wrap frame-wrap--white">
				<div className="container">
					<div className="halal-section">
						<h2>Halol sertifikat</h2>
						<p>Barcha mahsulotlarimiz Korea Muslim Federation (KMF) tomonidan sertifikatlangan</p>
						<div className="halal-cards">
							<div className="halal-card">
								<span>✅</span>
								<h3>KMF Sertifikati</h3>
								<p>Korea Muslim Federation tomonidan tasdiqlangan</p>
							</div>
							<div className="halal-card">
								<span>🔍</span>
								<h3>Sifat nazorati</h3>
								<p>Har bir mahsulot qat&apos;iy nazorat ostida tekshiriladi</p>
							</div>
							<div className="halal-card">
								<span>🚚</span>
								<h3>Toza yetkazish</h3>
								<p>Maxsus sovutgichli transport bilan yetkazib beriladi</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Store location */}
			<div className="frame-wrap">
				<div className="container">
					<div className="location-section">
						<h2>Do&apos;kon manzili</h2>
						<div className="location-layout">
							<div className="location-info">
								<div className="location-item">
									<span>📍</span>
									<div>
										<strong>Manzil</strong>
										<p>서울특별시 마포구 (Seoul, Mapo-gu)</p>
									</div>
								</div>
								<div className="location-item">
									<span>📞</span>
									<div>
										<strong>Telefon</strong>
										<p>877-3009</p>
									</div>
								</div>
								<div className="location-item">
									<span>🕐</span>
									<div>
										<strong>Ish vaqti</strong>
										<p>Dushanba - Shanba: 09:00 - 20:00</p>
										<p>Yakshanba: 10:00 - 18:00</p>
									</div>
								</div>
								<div className="location-item">
									<span>🚇</span>
									<div>
										<strong>Metro</strong>
										<p>Hapjeong station (Line 2, 6) — 5 daqiqa</p>
									</div>
								</div>
							</div>
							<div className="location-map">
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.5!2d126.9!3d37.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDMzJzAwLjAiTiAxMjbCsDU0JzAwLjAiRQ!5e0!3m2!1sko!2skr!4v1234567890"
									width="100%"
									height="300"
									style={{ border: 0, borderRadius: '12px' }}
									allowFullScreen
									loading="lazy"
									title="Mr. Halal location"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default withLayoutHome(AboutPage);
