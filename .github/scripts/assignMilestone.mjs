// @ts-check
/**
 * @param {import('github-script').AsyncFunctionArguments} AsyncFunctionArguments
 * @param {number} prNumber
 * @param {string} milestoneName
 */
export async function assignNextMilestone (
    { core, context, github },
    prNumber,
    milestoneName
) {
    core.debug("assignNextMilestone started");

    const milestones = await github.rest.issues.listMilestones({
        owner: context.repo.owner,
        repo: context.repo.repo
    });

    const nextMileStone = milestones.data.find(milestone => milestone.title === milestoneName);

    // Assign the milestone
    if (nextMileStone?.number) {
        core.debug(`Assigning milestone ${nextMileStone.title} to PR #${prNumber}`);
        await github.rest.issues.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: prNumber,
            milestone: nextMileStone.number
        });
    }
    return context.actor;
};

export default assignNextMilestone
