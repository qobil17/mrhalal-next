import type { NextPage } from 'next';
import { useReactiveVar } from '@apollo/client';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';
import { langVar, t } from '../../libs/i18n';

const AboutPage: NextPage = () => {
	const lang = useReactiveVar(langVar);

	return (
		<>
			{/* Hero */}
			<div className="about-hero">
				<div className="container">
					<h1>{t('aboutHeroTitle', lang)}</h1>
					<p>{t('aboutHeroSubtitle', lang)}</p>
				</div>
			</div>

			{/* About us */}
			<div className="frame-wrap">
				<div className="container">
					<div className="about-section">
						<div className="about-text">
							<h2>{t('aboutUsTitle', lang)}</h2>
							<p>{t('aboutUsParagraph1', lang)}</p>
							<p>{t('aboutUsParagraph2', lang)}</p>
							<div className="about-stats">
								<div className="about-stat">
									<strong>2015</strong>
									<span>{t('statYearLabel', lang)}</span>
								</div>
								<div className="about-stat">
									<strong>500+</strong>
									<span>{t('statCustomersLabel', lang)}</span>
								</div>
								<div className="about-stat">
									<strong>50+</strong>
									<span>{t('statProductsLabel', lang)}</span>
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
						<h2>{t('halalCertTitle', lang)}</h2>
						<p>{t('halalCertIntro', lang)}</p>
						<div className="halal-cards">
							<div className="halal-card">
								<span>✅</span>
								<h3>{t('halalCard1Title', lang)}</h3>
								<p>{t('halalCard1Text', lang)}</p>
							</div>
							<div className="halal-card">
								<span>🔍</span>
								<h3>{t('halalCard2Title', lang)}</h3>
								<p>{t('halalCard2Text', lang)}</p>
							</div>
							<div className="halal-card">
								<span>🚚</span>
								<h3>{t('halalCard3Title', lang)}</h3>
								<p>{t('halalCard3Text', lang)}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Store location */}
			<div className="frame-wrap">
				<div className="container">
					<div className="location-section">
						<h2>{t('storeLocationTitle', lang)}</h2>
						<div className="location-layout">
							<div className="location-info">
								<div className="location-item">
									<span>📍</span>
									<div>
										<strong>{t('addressLabel', lang)}</strong>
										<p>서울특별시 마포구 (Seoul, Mapo-gu)</p>
									</div>
								</div>
								<div className="location-item">
									<span>📞</span>
									<div>
										<strong>{t('phoneLabel', lang)}</strong>
										<p>877-3009</p>
									</div>
								</div>
								<div className="location-item">
									<span>🕐</span>
									<div>
										<strong>{t('hoursLabel', lang)}</strong>
										<p>{t('hoursWeekday', lang)}</p>
										<p>{t('hoursSunday', lang)}</p>
									</div>
								</div>
								<div className="location-item">
									<span>🚇</span>
									<div>
										<strong>{t('metroLabel', lang)}</strong>
										<p>{t('metroText', lang)}</p>
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
