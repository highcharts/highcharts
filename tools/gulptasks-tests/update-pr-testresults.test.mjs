import { describe, it, before, after } from 'node:test';
import { ok, notEqual, deepEqual } from 'node:assert';

import { rm } from 'node:fs/promises';

import {
    fetchExistingReview,
    fetchAllReviewsForVersion,
    writeCommentFile
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

describe('commentOnPR', () => {
    it('saves file to tmp folder', async () => {
        const content = `TITLE_TEXT
BODY_TEXT`;

        await writeCommentFile(content);
        const { default: written } = await import('../../tmp/pr-visual-test-comment.json', { with: { type: 'json' } });

        deepEqual(written, {
            title:'TITLE_TEXT',
            body: 'BODY_TEXT'
        });
    });

    after(async () => {
        await rm('tmp/pr-visual-test-comment.json');
    });
});
