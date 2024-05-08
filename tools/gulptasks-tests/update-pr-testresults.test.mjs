import { describe, it, before, after } from 'node:test';
import { ok, notEqual } from 'node:assert';

import {
    fetchExistingReview,
    fetchAllReviewsForVersion
} from '../gulptasks/update-pr-testresults.js';

const url = 'https://vrevs.highsoft.com/api/assets/visualtests/reviews/version-list.json';
const versions = await fetch(url).then(res => res.ok ? res.json() : null);

describe('Review fetching functions', async () => {
    // TODO: Investigate missing review
    await it.skip('should be able to fetch a single review', async () => {
        const singleReview = await fetchExistingReview('123456789');

        notEqual(singleReview, void 0, 'JSON should not be undefined');
        ok(Object.keys(singleReview).length > 0, 'JSON should have at least one element');

    });

    if (versions && Array.isArray(versions)) {
        await it('should be able to fetch allreview for a version ', async () => {
            const [version] = versions;
            const reviewsForVersion = await fetchAllReviewsForVersion(version);

            ok(
                reviewsForVersion,
                'JSON should not be undefined for version ' + version
            );
            ok(
                Object.keys(reviewsForVersion).length > 0,
                'JSON should have at least one element'
            );
        });
    } else it.skip(`Skipping test gently. Please check that ${url} exists.`)

});
