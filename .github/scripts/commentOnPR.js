// @ts-check
/**
 * @typedef {import('@octokit/rest').Octokit} Octokit
 * @typedef {import('@actions/github').context} GitHubContext
 */

/**
 * Creates or updates a pull request comment that matches the supplied title.
 *
 * @param {Octokit} github GitHub REST client.
 * @param {GitHubContext} context GitHub Actions runtime context.
 * @param {string} title Title used as the heading in the comment.
 * @param {string} body Markdown content that follows the heading.
 * @param {string} [matcher] Optional marker used to find an existing comment.
 * @return {Promise<void>}
 */
async function createOrUpdateComment(github, context, title, body, matcher) {
    const comments = await github.paginate(github.rest.issues.listComments, {
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        per_page: 100
    });

    const normalizedTitle = title.split('-')[0].trim();
    const commentToUpdate = comments.find(comment =>
        matcher ?
            (comment.body || '').includes(matcher) :
            (comment.body || '').startsWith(`## ${normalizedTitle}`)
    );

    const commentBody = `## ${title}
${body}`;

    if (commentToUpdate) {
        await github.rest.issues.updateComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: commentToUpdate.id,
            body: commentBody
        });
    } else {
        await github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: commentBody
        });
    }
}

module.exports = {
    createOrUpdateComment,
    default: createOrUpdateComment
};
