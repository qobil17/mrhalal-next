import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_ALL_BANNERS } from '../../../apollo/user/query';
import { langVar, t } from '../../i18n';

interface BannerData {
	id: string;
	title: string;
	imageUrl: string;
}

const SLIDE_INTERVAL = 4000;

const BannerSlider = () => {
	const lang = useReactiveVar(langVar);
	const [currentSlide, setCurrentSlide] = useState(0);

	const { data, loading } = useQuery<{ getAllBanners: BannerData[] }>(GET_ALL_BANNERS);
	const banners = data?.getAllBanners ?? [];

	useEffect(() => {
		if (banners.length <= 1) return;

		const timer = window.setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % banners.length);
		}, SLIDE_INTERVAL);

		return () => window.clearInterval(timer);
	}, [banners.length]);

	if (loading || banners.length === 0) return null;

	const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
	const goToNext = () => setCurrentSlide((prev) => (prev + 1) % banners.length);

	return (
		<div className="banner-slider">
			{banners.map((banner, index) => (
				<div key={banner.id} className={`banner-slide${index === currentSlide ? ' active' : ''}`}>
					<Image
						src={banner.imageUrl}
						alt={banner.title}
						fill
						sizes="100vw"
						style={{ objectFit: 'cover' }}
						priority={index === 0}
					/>
					<div className="banner-slide-overlay">
						<h2>{banner.title}</h2>
						<Link href="/products" className="banner-btn">
							{t('bannerCtaButton', lang)}
						</Link>
					</div>
				</div>
			))}

			{banners.length > 1 && (
				<>
					<button type="button" className="banner-arrow prev" onClick={goToPrev} aria-label={t('bannerPrevAria', lang)}>
						‹
					</button>
					<button type="button" className="banner-arrow next" onClick={goToNext} aria-label={t('bannerNextAria', lang)}>
						›
					</button>

					<div className="banner-dots">
						{banners.map((banner, index) => (
							<button
								key={banner.id}
								type="button"
								className={`dot${index === currentSlide ? ' active' : ''}`}
								onClick={() => setCurrentSlide(index)}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default BannerSlider;
