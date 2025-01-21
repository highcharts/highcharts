# Contributor's Guide

First of all, thank you for contributing to Highcharts! :+1: :confetti_ball:

This file outlines the guidelines for contributing source code to the Highcharts
repository, as well as writing good issue reports.

## Contents

1. [Reporting Bugs](#reporting-bugs)
    1. [Test a fix](#test-a-fix)
    2. [Writing a Clear Bug Report](#writing-a-clear-bug-report)
2. [Suggesting Features and/or Enhancements](#suggesting-features-and-enhancements)
3. [Contributing Code](#contributing-code)
    1. [Licensing And Legal](#licensing-and-legal)
    2. [Style Guide](#style-guide)
    3. [Pull Requests](#pull-requests)
    5. [Writing content for the changelog](#writing-content-for-the-changelog)

## Reporting Bugs

We track bugs on the repository's [GitHub issue tracker](https://github.com/highcharts/highcharts/issues).

Before submitting a [new bug report](https://github.com/highcharts/highcharts/issues/new/choose),
please try to search existing (open and closed) issues to see if the issue is
already reported. If you find an existing open issue, please add any additional
information you might have on the bug to the existing ticket.

We use GitHub Issues as our official bug tracker. We strive to keep this a
clean, maintainable and searchable record of our open and closed bugs, therefore
we kindly ask you to obey some rules before reporting an issue:

1. Make sure the report is accompanied by a reproducible demo. The ideal demo is
created by forking [our standard jsFiddle](http://jsfiddle.net/highcharts/LLExL/),
adding your own code and stripping it down to an absolute minimum needed to
demonstrate the bug.
2. Always add information on what browser it applies to, and other information
needed for us to debug.
3. It may be that the bug is already fixed. See [Test a fix](#test-a-fix).

If you find a closed issue describing your problem, please open a new issue and
link to the closed one in your issue description (use `#<ticket number>`, e.g.
`#12345`).

Please also follow the directions in our [ticket submission template](https://github.com/highcharts/highcharts/blob/main/ISSUE_TEMPLATE.md).

### Test a fix

When an issue is resolved, we commit a fix and mark the issue closed. This
doesn't mean that a new release is available with the fix applied, but that it
is fixed in the development code and will be added to the next stable release.
Stable versions are typically released every 1-3 months.

To try out the fix immediately, using the official CDN, you can run
http://github.highcharts.com/highcharts.js or
http://github.highcharts.com/highstock.js from any website, but do not use these
URLs in production.

A nightly build is available as a Node module and is fully described in the
[documentation](https://www.highcharts.com/docs/getting-started/install-from-npm#installing-nightly-builds-of-highcharts).
It can also be access by a CDN, like jsdelivr, (e.g.
`https://cdn.jsdelivr.net/gh/highcharts/highcharts-dist@nightly/highcharts.js`).

### Writing a Clear Bug Report

To help us find and resolve issues as quickly as possible, it's important that
your issue description contains a clear description of the problem.

Your issue should:

* have a clear and descriptive title.
* include any `console.error` output related to the issue.
* describe the expected behaviour/output.
* link to a JSFiddle demo of the issue.
* if it's not reproducible in a minimal demo, explain what actions where done to
trigger the bug.
* include the tested Highcharts and browser version(s).

## Suggesting Features and Enhancements

Features and enhancements can be suggested as a [Github issue: feature request](https://github.com/highcharts/highcharts/issues/new?assignees=&labels=Type%3A+Feature+Request&projects=&template=feature_request.md&title=).

Before submitting, please try to search existing (open and closed) issues to see
if the issue is already reported.

## Contributing Code

### Licensing And Legal

Please note that when you contribute code to the Highcharts repository that code
will be part of the Highcharts source base, which is a commercial product.

For this reason, submissions may not contain code that prevents or limits
commercial usage in closed-source applications. To ensure this, submissions must
be licensed using one of the following licenses:

* [Apache License 2.0](https://opensource.org/licenses/apache2.0)
* [BSD Licence](https://opensource.org/licenses/BSD-3-Clause)
* [MIT / X11 License](https://opensource.org/licenses/MIT)
* [Mozilla Public License](https://opensource.org/licenses/MPL-2.0)

No other license is permitted for contributions.

A reference to the license and the author of the code *must* be present in a
comment leading into the submitted code block, in a way that makes it clear
*which code falls under the license, and where/who it came from*.

As an example:
```
/**
 * The following function is licensed under the MIT license.
 * Author: John Doe
 */
function anMITLicensedFunction () {
<some awesome code in here>
}
```

### Style Guide

**Commit Messages**

Commits should use the following format:
* past tense, e.g. `Fixed..` rather than `Fixes..`
* try to limit the name to <=100 characters
* fixes should refer to issues where applicable, i.e.
`Fixed #1235, <description>`

**TypeScript**

We use the following TypeScript style:
* spaces over tabs.
* 4 character indentation.
* max columns in a line is 80.
* top-level declarations.
* no `console.*`.
* single quotes.

More about coding recommendations can be found in [Highcharts Internals](ts/README.md).

This style is enforced by ESLint, which is run in a post-commit hook.

### Pull Requests

We utilize a pull request based workflow. This means that all work is done in
feature/fix branches, and then merged through pull requests.

We use a standard naming convention for these branches:

* `feature/<description>`: the branch contains a new feature.
* `bugfix/<issuenumber>-<description>`: the branch contains a bugfix for an open
issue.
* `docs/<description>`: the branch contains a fix to the documentation/doclets.

Your pull request should:

* use the branch name (or follow the branch naming convention if the PR is based
on the master branch on a fork) as the title.
* contain a link to an open issue - if there is one - in the description.
* contain a description of what the pull request implements/fixes.

### Writing content for the changelog

The changelog is generated from PR descriptions. The following rules apply:

1. All PRs that should go into the changelog must be labeled with either
`Changelog: Feature` or `Changelog: Bugfix`. Everything else is ignored.
2. Label the PR with `Product: Highcharts Stock`, `Product: Highcharts Maps`
etc. for specific products. PRs with no product tags go into the Highcharts
changelog.
3. Only the first paragraph of the description is used. Anything below the first
line break `\n` is removed (except upgrade notes).
4. Upgrade notes are marked with `#### Upgrade note`, then the _next paragraph_,
or the _subsequent items of a bullet list_ after this will be parsed as upgrade
notes into the changelog.
5. For consistency, bug fixes should start with "Fixed #xxxx,
[some description...]". Lower case after the comma.
6. Since the changelog refers to changes that were done by a past release, write
in past tense.
7. Describe bug fixes in a way that users recognize and can relate to their
issue. It should describe the bug it fixes, rather than (or in addition to)
describing the internals of how it was fixed.
8. Names of API members should be written with code formatting.
    * Bad: Fixed issue with dataGrouping.
    * Good: Fixed issue with `dataGrouping`.
    * Good: Fixed issue with data grouping.
