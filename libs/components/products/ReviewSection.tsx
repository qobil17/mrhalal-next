import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_PRODUCT_REVIEWS, GET_PRODUCT_BY_SLUG } from '../../../apollo/user/query';
import { CREATE_REVIEW } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/client';
import { langVar, t } from '../../i18n';
import type { Member } from '../../types/member/member';

interface Review {
	id: string;
	rating: number;
	comment?: string;
	createdAt: string;
	member: { id: string; firstName: string; avatar?: string };
}

interface ReviewsResponse {
	list: Review[];
	total: number;
}

interface ReviewSectionProps {
	productId: string;
	slug: string;
}

const STARS = [1, 2, 3, 4, 5];

const ReviewSection = ({ productId, slug }: ReviewSectionProps) => {
	const user = useReactiveVar(userVar) as Member | null;
	const lang = useReactiveVar(langVar);
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState('');
	const [message, setMessage] = useState('');

	const { data, loading, refetch } = useQuery<{ getProductReviews: ReviewsResponse }>(GET_PRODUCT_REVIEWS, {
		variables: { productId: Number(productId), input: { page: 1, limit: 20 } },
	});

	const [createReview, { loading: submitting }] = useMutation(CREATE_REVIEW, {
		refetchQueries: [{ query: GET_PRODUCT_BY_SLUG, variables: { slug } }],
	});

	const reviews = data?.getProductReviews?.list ?? [];

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setMessage('');

		try {
			await createReview({ variables: { input: { productId: Number(productId), rating, comment } } });
			setComment('');
			setRating(5);
			setMessage(t('reviewThanks', lang));
			await refetch();
		} catch (err) {
			setMessage(err instanceof Error ? err.message : t('genericError', lang));
		}
	};

	return (
		<section className="review-section">
			<h2>{t('reviews', lang)} ({data?.getProductReviews?.total ?? 0})</h2>

			{user ? (
				<form className="review-form" onSubmit={handleSubmit}>
					<div className="review-star-picker">
						{STARS.map((star) => (
							<button
								key={star}
								type="button"
								className={star <= rating ? 'star active' : 'star'}
								onClick={() => setRating(star)}
								aria-label={`${star} stars`}
							>
								★
							</button>
						))}
					</div>
					<textarea
						placeholder={t('reviewPlaceholder', lang)}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						minLength={5}
						maxLength={2000}
						required
					/>
					{message && <p className="review-message">{message}</p>}
					<button type="submit" className="review-submit-btn" disabled={submitting}>
						{submitting ? t('placingOrder', lang) : t('submitReview', lang)}
					</button>
				</form>
			) : (
				<p className="empty-text">
					<Link href="/auth">{t('loginToReview', lang)}</Link>
				</p>
			)}

			{loading ? (
				<p className="loading-text">{t('loading', lang)}</p>
			) : reviews.length > 0 ? (
				<div className="review-list">
					{reviews.map((review) => (
						<div key={review.id} className="review-card">
							<div className="review-card-header">
								<strong>{review.member.firstName}</strong>
								<span className="review-stars">{'★'.repeat(review.rating)}</span>
							</div>
							{review.comment && <p>{review.comment}</p>}
							<span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
						</div>
					))}
				</div>
			) : (
				<p className="empty-text">{t('noReviews', lang)}</p>
			)}
		</section>
	);
};

export default ReviewSection;
