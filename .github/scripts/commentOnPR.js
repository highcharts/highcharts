async function createOrUpdateComment(github, context, title, body){
    const { data: comments } = await github.rest.issues.listComments({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo
    });

    const commentToUpdate = comments.find(comment =>
        comment.body.startsWith('## ' + title)
    );

    const commentBody = `## ${title}
${body}`;

    if (commentToUpdate) {
        github.rest.issues.updateComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: commentToUpdate.id,
            body: commentBody
        });
    } else {
        github.rest.issues.createComment({
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
}
