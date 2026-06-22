import Link from 'next/link';
import Image from 'next/image';
import { useReactiveVar } from '@apollo/client';
import { Category } from '../../types/category/category';
import { getLocalizedName, langVar, t } from '../../i18n';

interface FallbackCategory {
	id: number;
	nameUz: string;
	nameKo: string;
	emoji: string;
	slug: string;
}

const FALLBACK_CATEGORIES: FallbackCategory[] = [
	{ id: 1, nameUz: "Mol go'shti", nameKo: '소고기', emoji: '🥩', slug: 'beef' },
	{ id: 2, nameUz: "Qo'y go'shti", nameKo: '양고기', emoji: '🐑', slug: 'lamb' },
	{ id: 3, nameUz: 'Tovuq', nameKo: '닭고기', emoji: '🍗', slug: 'chicken' },
	{ id: 4, nameUz: 'Baliq', nameKo: '생선', emoji: '🐟', slug: 'fish' },
	{ id: 5, nameUz: 'Oziq-ovqat', nameKo: '식료품', emoji: '🛒', slug: 'grocery' },
	{ id: 6, nameUz: 'Ziravorlar', nameKo: '향신료', emoji: '🌶️', slug: 'spices' },
];

const SLUG_EMOJI: Record<string, string> = {
	beef: '🥩',
	lamb: '🐑',
	chicken: '🍗',
	fish: '🐟',
	grocery: '🛒',
	spices: '🌶️',
	'halal-meat': '🥩',
	dairy: '🥛',
	vegetables: '🥦',
};

const DEFAULT_EMOJI = '🛒';

interface CategoryScrollProps {
	categories?: Category[];
}

const CategoryScroll = ({ categories }: CategoryScrollProps) => {
	const items = categories && categories.length > 0 ? categories : null;
	const lang = useReactiveVar(langVar);

	return (
		<section className="category-scroll-section">
			<h3>{t('categories', lang)}</h3>
			<div className="category-scroll">
				{items
					? items.map((category) => (
							<Link key={category.id} href={`/products?category=${category.slug}`} className="category-item">
								<div className="category-icon">
									{category.image ? (
										<Image
											src={category.image}
											alt={getLocalizedName(category, lang)}
											width={48}
											height={48}
											style={{ objectFit: 'cover', borderRadius: '50%' }}
										/>
									) : (
										SLUG_EMOJI[category.slug] ?? DEFAULT_EMOJI
									)}
								</div>
								<span className="category-name">{getLocalizedName(category, lang)}</span>
							</Link>
						))
					: FALLBACK_CATEGORIES.map((category) => (
							<Link key={category.id} href={`/products?category=${category.slug}`} className="category-item">
								<div className="category-icon">{category.emoji}</div>
								<span className="category-name">{getLocalizedName(category, lang)}</span>
							</Link>
						))}
			</div>
		</section>
	);
};

export default CategoryScroll;
