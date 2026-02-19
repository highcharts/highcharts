# CODE REVIEW GUIDELINES

This document is meant to describe the best practices we follow for code reviewing.

We generally recommend **at least two reviewers** participating in the reviewing process.

**Note: Reviewers are co-responsible for accepted PRs.**

## Why do we review code?

Code reviewing helps share knowledge and improve code quality. It can be a great form of mentoring, and applying broad knowledge across the team. In addition, it functions as a security measure.

These benefits are not obtained unless code reviews are done with at least a minimum level of detail and scrutiny, which is why we have the following guidelines. 

## General guidelines

### Security first!

- Obviously no access tokens or similar in checked-in code.
- If the PR contains any security-sensitive work, always ensure somebody with relevant expertise has reviewed it.
- Coding assistants may at times generate copyrighted code. Look for any signs of this, and flag if you notice it.
- **Always ensure you understand what the code does before you run it.**

### Detail level

- Focus on every detail only in the first few code reviews for an employee. This maximizes knowledge sharing early, without going into too much detail every time.
- Avoid an infinite loop of code reviewing and updating. At a certain point, it is more efficient to suggest pair programming.
- Don't wait too long before reviewing. 24 hours is a general maximum guideline, as fast reviews reduces the burden of context switching.
- Don't spend too long on a review. 2 hours is a general maximum guideline. Prioritize the areas where you think your review can be most useful.
- You should generally always check out the branch, build, and run the code.
- Partial reviews are okay. If you are asked to review a specific area of the code, you do not have to review everything.
  * Make it clear which parts of the code you have reviewed.
- Sometimes perfect is the enemy of good, and a PR can be accepted even if there are minor things you could nitpick on. Use common sense here.

### Form

- Be nice, avoid sarcasm. Useful phrases: "I think...", "How about...", "What do you think..."
- Feel free to give "nice idea!" comments too!
- Use concise language (e.g. "Missing semicolon")
- Explain how and why (e.g. solution may lead potential issues in the future, breaks a principle, solution can be faster, more secure, readable, requires less code)
- Generally try not to solve the problem, give direction instead (e.g. proof of concept, pseudocode). Sometimes this is less efficient than just giving the code, in which case you should use common sense.
- If something is not clear, ask for explanation. It may require a comment in the code, or clearer naming/structure. If you don't understand, most likely someone else will also struggle.

### Disagreements

- If the reviewer and author can not agree, first try to figure out the solution together and reach consensus.
- Always remain polite.
- Short meetings or Slack-DMs can be more efficient than trying to discuss in a PR thread. Remember to write summaries in the PR if relevant, so that other people can follow the decisions.
- It is important to get all facts and opinions on the table, and discuss the options with clear reasoning, regardless of the seniority of the people involved.
- If agreement can not be reached, escalate and bring in other developers to join the discussion. A developer or tech lead with more seniority can make the final call after the options have been considered.
- If you think someone with more seniority is too strict: Sometimes this is necessary, but we should be good at communicating why decisions are made, and it is always okay to push back and ask for clarification on this.

## Specific things to look out for

### PR details, code style

- Correct labels on the PR.
- If relevant: Proper description for the changelog: https://github.com/highcharts/highcharts/blob/master/CONTRIBUTING.md#writing-content-for-the-changelog

### Core code changes

- In general, be extra vigilant with core code changes.
- Always consider performance and code size.
- Always consider security implications.
- Always look for signs of copyrighted code.
- Look for any inconsistencies with what we already have (e.g. across API options, conventions).
- Code quality checks:
  * Does the solution make sense at a high level? Is it the correct approach?
  * Pragmatically apply best practices principles from Clean Code and the likes, using common sense:
    1. Should we split methods into smaller ones (Do one thing principle)?
    2. Can we reorganize methods (avoid logical dependencies)?
    3. Can we refactor something (simplify logic, rename variables to be more intuitive)?
    4. Too many function arguments?
    5. Does this code belong to this module?
    6. DRY/SRY
    7. YAGNI
    8. How much file size does this code produce? Less is better.
  * Performance matters. Looping through data points can take a long time, for example.
  * Check every line for obvious issues like:
    1. Unnecessary imports
    2. Commented-out code
    3. Missing comments or doclets for functions
  - Ensure code follows our [Code guidelines](https://github.com/highcharts/highcharts/blob/master/repo-guidelines.md#style-guide).

### Docs

- Ensure docs are added if needed, both in tutorial docs and API ref. Build the docs and check.
- Check language and grammar, and ensure documentation is easy to follow for beginners.
- Ensure docs contain enough demos and code examples.

### Samples & tests

- Run the samples and tests locally to observe any issues.
- Tests should reuse existing charts instead of creating new ones. Avoid creating lots of chart instances, it is more performant to update existing instances.
  * For this reason, it is often preferable to combine related unit tests into a single file.
- Only use necessary options, minimal configurations. This is for performance reasons.
- Tests **MUST NOT** depend on other tests/states.
- Ensure light/dark mode does not totally break. Full theming is not needed, but samples should be readable for both light & dark mode.

### Demos

- Run demos locally to observe any issues or potential improvements.
- Responsiveness: Test the demos on mobile. They should work down to 320px width.
- Only necessary options should be set.
- The demo should look great in both light & dark mode. If it looks like the demo needs review by a designer, flag this. It should look good enough that someone could put it straight into their product.
- Consider a11y, and if it needs a separate a11y review. For starters, try keyboard navigating it without a screen reader (TAB button and arrow keys).
- Consider if the dataset is engaging and modern.
 
