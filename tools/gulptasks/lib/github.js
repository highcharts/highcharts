const request = require('request');
const logLib = require('./log');
const argv = require('yargs').argv;

const DEFAULT_OPTIONS = {
    method: 'GET',
    json: true,
    headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${process.env.GITHUB_TOKEN || argv.token}`,
        'User-Agent': 'Highcharts PR Commenter'
    }
};

/**
* Executes a request with the specified options
*
* @param {any} options to add (see node request module)
* @return {Promise<*> | Promise | Promise} Promise to keep
*/
function doRequest(options = {}) {
    logLib.message(options.method + ' request to ' + options.url);
    return new Promise((resolve, reject) => {
        request(options, (error, response, data) => {
            if (error || response.statusCode >= 400) {
                reject(error ? error : `HTTP ${response.statusCode} - ${data.message}`);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * Fetches the pull request comments and filters them by user and filter text.
 *
 * @param {number} pr to fetch comments for
 * @param {string} user to filter on
 * @param {string} filterText to filter on
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function fetchPRComments(pr, user, filterText) {
    if (argv.dryrun) {
        return Promise.resolve('Dryrun (skipping fetch of PR comments)..');
    }
    return new Promise((resolve, reject) => {
        doRequest({
            ...DEFAULT_OPTIONS,
            url: `https://api.github.com/repos/highcharts/highcharts/issues/${pr}/comments`
        }).then(response => {
            let comments = [];
            if (response.length > 0) {
                comments =
                    response.filter(
                        comment => comment.user.login === user && comment.body && comment.body.includes(filterText)
                    );
            }
            resolve(comments);
        })
            .catch(err => {
                reject(new Error(`Failed to fetch comments for PR #${pr}.: ` + err));
            });
    });
}

/**
 * Creates a Github PR comment
 * @param {number} pr number
 * @param {string} comment to post
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function createPRComment(pr, comment) {
    if (argv.dryrun) {
        logLib.message('(Dryrun) Skipping creation of pr comment: ', comment);
        // eslint-disable-next-line camelcase
        return Promise.resolve({ html_url: 'No where' });
    }

    return new Promise((resolve, reject) => {
        doRequest({
            ...DEFAULT_OPTIONS,
            url: `https://api.github.com/repos/highcharts/highcharts/issues/${pr}/comments`,
            method: 'POST',
            body: { body: comment }
        })
            .then(result => {
                logLib.message(`Comment created at ${result.html_url}`);
                resolve(result);
            })
            .catch(err => {
                const failureMsg = 'Failed to create PR comment: ' + err;
                logLib.warn(failureMsg);
                if (argv.failSilently) {
                    resolve(failureMsg);
                }
                reject(new Error(failureMsg));
            });
    });
}

/**
 * Updates an existing Github comment
 *
 * @param {number} commentId to update
 * @param {string} newComment to overwrite existing one
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
async function updatePRComment(commentId, newComment) {
    if (argv.dryrun) {
        logLib.message('Dryrun (skipping update of PR comment): ', newComment);
        // eslint-disable-next-line camelcase
        return Promise.resolve({ html_url: 'No where' });
    }

    logLib.message('Updating existing comment with id ' + commentId);
    return new Promise((resolve, reject) => {
        doRequest({
            ...DEFAULT_OPTIONS,
            url: `https://api.github.com/repos/highcharts/highcharts/issues/comments/${commentId}`,
            method: 'PATCH',
            body: { body: newComment }
        })
            .then(response => {
                logLib.message(`Comment updated at ${response.html_url}`);

                resolve(response);
            })
            .catch(err => {
                logLib.warn('Failed to update existing PR comment: ' + err);
                reject(err);
            });
    });
}

module.exports = {
    doRequest,
    createPRComment,
    updatePRComment,
    fetchPRComments
};
