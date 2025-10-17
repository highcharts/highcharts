// @ts-check

const { Octokit } = require('@octokit/rest');

/**
 * Sets (or updates) the commit status using either a provided Octokit instance or a token.
 *
 * @param {object} options Configuration for the status update.
 * @param {import('@octokit/rest').Octokit} [options.github] Optional Octokit instance to reuse.
 * @param {string} [options.token] Personal access token or workflow token (required if no Octokit instance).
 * @param {string} options.owner Repository owner.
 * @param {string} options.repo Repository name.
 * @param {string} options.sha Commit SHA to attach the status to.
 * @param {'error'|'failure'|'pending'|'success'} options.state Commit status state.
 * @param {string} [options.description] Short description displayed next to the status.
 * @param {string} [options.targetUrl] URL shown when clicking the status.
 * @param {string} [options.context='default'] Context label for the status.
 * @return {Promise<import('@octokit/openapi-types').components['schemas']['status']>}
 *         Resolves with the GitHub status payload.
 */
async function setCommitStatus(options) {
    const {
        github,
        token,
        owner,
        repo,
        sha,
        state,
        description,
        targetUrl,
        context = 'default'
    } = options;

    if (!github && !token) {
        throw new Error('setCommitStatus requires either a GitHub client instance or a token');
    }

    const client = github || new Octokit({
        auth: token,
        userAgent: 'Highcharts Commit Status Setter'
    });

    const response = await client.repos.createCommitStatus({
        owner,
        repo,
        sha,
        state,
        description,
        context,
        // eslint-disable-next-line camelcase
        target_url: targetUrl
    });

    return response.data;
}

module.exports = {
    setCommitStatus,
    default: setCommitStatus
};
