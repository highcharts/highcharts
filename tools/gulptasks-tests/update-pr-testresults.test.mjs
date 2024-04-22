import { describe, it, before, after } from 'node:test';
import { ok, notEqual } from 'node:assert';

import {
    fetchExistingReview,
    fetchAllReviewsForVersion
} from '../gulptasks/update-pr-testresults.js';

describe('', async ()=>{

    // TODO: Investigate missing review
    it.skip('should be able to fetch a single review', async () => {
        const singleReview = await fetchExistingReview('123456789');

        notEqual(singleReview, undefined, 'JSON should not be undefined');
        ok(Object.keys(singleReview).length > 0, 'JSON should have at least one element');

    });

    // TODO: Update the version used
    it('should be able to fetch allreview for a version ', async ()=>{
        const reviewsForVersion = await fetchAllReviewsForVersion('11.1.0');

        ok(reviewsForVersion, 'JSON should not be undefined');
        ok(Object.keys(reviewsForVersion).length > 0, 'JSON should have at least one element');

    });

})


