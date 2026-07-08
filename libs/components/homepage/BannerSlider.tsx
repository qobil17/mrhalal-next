import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { langVar, t, type TranslationKey } from '../../i18n';

interface BannerSlideConfig {
	id: number;
	background: string;
	titleKey: TranslationKey;
	subtitleKey: TranslationKey;
	buttonKey: TranslationKey;
	buttonLink: string;
}

const SLIDES: BannerSlideConfig[] = [
	{
		id: 1,
		background: '#CC1B1B',
		titleKey: 'banner1Title',
		subtitleKey: 'banner1Subtitle',
		buttonKey: 'banner1Button',
		buttonLink: '/products',
	},
	{
		id: 2,
		background: '#1A9E6B',
		titleKey: 'banner2Title',
		subtitleKey: 'banner2Subtitle',
		buttonKey: 'banner2Button',
		buttonLink: '/products',
	},
	{
		id: 3,
		background: '#8B0000',
		titleKey: 'banner3Title',
		subtitleKey: 'banner3Subtitle',
		buttonKey: 'banner3Button',
		buttonLink: '/about',
	},
];

const BannerSlider = () => {
	const lang = useReactiveVar(langVar);
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const timer = window.setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
		}, 3000);

		return () => window.clearInterval(timer);
	}, []);

	const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
	const goToNext = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);

	return (
		<div className="banner-slider">
			{SLIDES.map((slide, index) => (
				<div
					key={slide.id}
					className={`banner-slide${index === currentSlide ? ' active' : ''}`}
					style={{ background: slide.background }}
				>
					<h2>{t(slide.titleKey, lang)}</h2>
					<p>{t(slide.subtitleKey, lang)}</p>
					<Link href={slide.buttonLink} className="banner-btn" style={{ color: slide.background }}>
						{t(slide.buttonKey, lang)}
					</Link>
				</div>
			))}

			<button type="button" className="banner-arrow prev" onClick={goToPrev} aria-label={t('bannerPrevAria', lang)}>
				‹
			</button>
			<button type="button" className="banner-arrow next" onClick={goToNext} aria-label={t('bannerNextAria', lang)}>
				›
			</button>

			<div className="banner-dots">
				{SLIDES.map((slide, index) => (
					<button
						key={slide.id}
						type="button"
						className={`dot${index === currentSlide ? ' active' : ''}`}
						onClick={() => setCurrentSlide(index)}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
};

export default BannerSlider;
