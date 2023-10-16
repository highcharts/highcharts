import { ok, notEqual } from 'node:assert';

import {
    fetchExistingReview,
    fetchAllReviewsForVersion
} from '../gulptasks/update-pr-testresults.js';

const singleReview = await fetchExistingReview('123456789');

notEqual(singleReview, undefined, 'JSON should not be undefined');
ok(Object.keys(singleReview).length > 0, 'JSON should have at least one element');

const reviewsForVersion = await fetchAllReviewsForVersion('11.0.0');

ok(reviewsForVersion, 'JSON should not be undefined');
ok(Object.keys(reviewsForVersion).length > 0, 'JSON should have at least one element');

