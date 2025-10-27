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
 * @return {Promise<void>}
 */
async function createOrUpdateComment(github, context, title, body) {
    const { data: comments } = await github.rest.issues.listComments({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo
    });

    const normalizedTitle = title.split('-')[0].trim();
    const commentToUpdate = comments.find(comment =>
        (comment.body || '').startsWith('## ' + normalizedTitle)
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
