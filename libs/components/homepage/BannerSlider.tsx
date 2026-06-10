import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BannerSlide {
	id: number;
	background: string;
	title: string;
	subtitle: string;
	buttonText: string;
	buttonLink: string;
}

const slides: BannerSlide[] = [
	{
		id: 1,
		background: '#CC1B1B',
		title: 'Yangi mahsulotlar keldi!',
		subtitle: 'Beef · Lamb · Chicken',
		buttonText: "Ko'rish →",
		buttonLink: '/products',
	},
	{
		id: 2,
		background: '#1A9E6B',
		title: 'Ramazon aksiyasi!',
		subtitle: 'Barcha mahsulotlarda 10% chegirma',
		buttonText: 'Buyurtma bering →',
		buttonLink: '/products',
	},
	{
		id: 3,
		background: '#8B0000',
		title: 'Toza va sertifikatlangan',
		subtitle: '100% Halal kafolati',
		buttonText: 'Batafsil →',
		buttonLink: '/about',
	},
];

const BannerSlider = () => {
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const timer = window.setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 3000);

		return () => window.clearInterval(timer);
	}, []);

	const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	const goToNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

	return (
		<div className="banner-slider">
			{slides.map((slide, index) => (
				<div
					key={slide.id}
					className={`banner-slide${index === currentSlide ? ' active' : ''}`}
					style={{ background: slide.background }}
				>
					<h2>{slide.title}</h2>
					<p>{slide.subtitle}</p>
					<Link href={slide.buttonLink} className="banner-btn" style={{ color: slide.background }}>
						{slide.buttonText}
					</Link>
				</div>
			))}

			<button type="button" className="banner-arrow prev" onClick={goToPrev} aria-label="Previous slide">
				‹
			</button>
			<button type="button" className="banner-arrow next" onClick={goToNext} aria-label="Next slide">
				›
			</button>

			<div className="banner-dots">
				{slides.map((slide, index) => (
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
