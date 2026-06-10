import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface Category {
	id: number;
	name: string;
	nameKo: string;
	emoji: string;
	slug: string;
}

const categories: Category[] = [
	{ id: 1, name: "Mol go'shti", nameKo: '소고기', emoji: '🥩', slug: 'beef' },
	{ id: 2, name: "Qo'y go'shti", nameKo: '양고기', emoji: '🐑', slug: 'lamb' },
	{ id: 3, name: 'Tovuq', nameKo: '닭고기', emoji: '🍗', slug: 'chicken' },
	{ id: 4, name: 'Baliq', nameKo: '생선', emoji: '🐟', slug: 'fish' },
	{ id: 5, name: 'Oziq-ovqat', nameKo: '식료품', emoji: '🛒', slug: 'grocery' },
	{ id: 6, name: 'Ziravorlar', nameKo: '향신료', emoji: '🌶️', slug: 'spices' },
];

const CategoryScroll = () => {
	const device = useDeviceDetect();

	return (
		<section className="category-scroll-section">
			<h3>{device === 'mobile' ? 'Kategoriyalar' : "Kategoriyalar bo'yicha xarid qiling"}</h3>
			<div className="category-scroll">
				{categories.map((category) => (
					<Link key={category.id} href={`/products?category=${category.slug}`} className="category-item">
						<div className="category-icon">{category.emoji}</div>
						<span className="category-name">{category.name}</span>
						<span className="category-name-ko">{category.nameKo}</span>
					</Link>
				))}
			</div>
		</section>
	);
};

export default CategoryScroll;
