import { makeVar } from '@apollo/client';

export type Lang = 'UZ' | 'KO' | 'EN';

const LANG_STORAGE_KEY = 'lang';
const DEFAULT_LANG: Lang = 'UZ';

// Always starts with the same fixed default on both server and client so the
// first client render matches the server-rendered HTML. The real (persisted)
// language is applied afterwards via initLangFromStorage(), called from a
// useEffect — i.e. only after hydration has completed.
export const langVar = makeVar<Lang>(DEFAULT_LANG);

export const initLangFromStorage = (): void => {
	if (typeof window === 'undefined') return;

	const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
	if (stored === 'UZ' || stored === 'KO' || stored === 'EN') {
		langVar(stored);
	}
};

export const setLang = (lang: Lang): void => {
	langVar(lang);
	if (typeof window !== 'undefined') {
		window.localStorage.setItem(LANG_STORAGE_KEY, lang);
	}
};

interface LocalizedNames {
	nameUz: string;
	nameKo: string;
	nameEn?: string | null;
}

export const getLocalizedName = (entity: LocalizedNames, lang: Lang): string => {
	if (lang === 'KO') return entity.nameKo;
	if (lang === 'EN') return entity.nameEn || entity.nameUz;
	return entity.nameUz;
};

const STRINGS = {
	UZ: {
		home: 'Home',
		products: 'Products',
		about: 'About',
		login: 'Login',
		logout: "Chiqish",
		newProducts: 'Yangi mahsulotlar',
		featured: 'Tavsiya etiladi',
		allProducts: 'Barcha mahsulotlar',
		showMore: "Ko'proq ko'rish",
		categories: 'Kategoriyalar',
		addToCart: 'Savatga',
	},
	KO: {
		home: '홈',
		products: '제품',
		about: '소개',
		login: '로그인',
		logout: '로그아웃',
		newProducts: '신상품',
		featured: '추천 상품',
		allProducts: '전체 상품',
		showMore: '더 보기',
		categories: '카테고리',
		addToCart: '장바구니',
	},
	EN: {
		home: 'Home',
		products: 'Products',
		about: 'About',
		login: 'Login',
		logout: 'Logout',
		newProducts: 'New products',
		featured: 'Featured',
		allProducts: 'All products',
		showMore: 'Show more',
		categories: 'Categories',
		addToCart: 'Add to cart',
	},
} satisfies Record<Lang, Record<string, string>>;

export type TranslationKey = keyof typeof STRINGS.UZ;

export const t = (key: TranslationKey, lang: Lang): string => STRINGS[lang][key];
