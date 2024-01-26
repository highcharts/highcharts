## Writing content for the changelog
The changelog is generated from PR descriptions. The following rules apply:
1. All PRs that should go into the changelog must be labeled with either
`Changelog: Feature` or `Changelog: Bugfix`. Everything else is ignored.
2. Label the PR with `Product: Highcharts Stock`, `Product: Highcharts Maps` etc. for specific
products. PRs with no product tags go into the Highcharts changelog.
3. Only the first paragraph of the description is used. Anything below the first
line break `\n` is removed (except upgrade notes).
4. Upgrade notes are marked with `#### Upgrade note`, then the _next paragraph_,
or the _subsequent items of a bullet list_ after this will be parsed as upgrade
notes into the changelog.
5. For consistency, bug fixes should start with "Fixed #xxxx, [some description...]". Lower case after the comma.
6. Since the changelog refers to changes that were done by a past release, write
in past tense.
7. Describe bug fixes in a way that users recognize and can relate to their
issue. It should describe the bug it fixes, rather than (or in addition to)
describing the internals of how it was fixed.
8. Names of API members should be written with code formatting.
    * Bad: Fixed issue with dataGrouping.
    * Good: Fixed issue with `dataGrouping`.
    * Good: Fixed issue with data grouping.


## Workflow of generating the changelog
1. Run the script that copies PR descriptions since the last release into markdown files for each product. When including feature branches (typically on minor/major releases), remember to add the `branches` argument: `--branches master,v11`. Since Highcharts Dashboards releases aren't in sync with the rest of packages, to generate only the Dashboards changelog, use the `--dashboards` flag and `--release x.x.x` to specify the version number of the Highcharts Dashboards release.

    ```
    node changelog/generate --review
    ```

    or
    ```
    node changelog/generate --dashboards --release 1.0.0
    ```

    If a `tree.json` error occurs, run `npx gulp jsdoc-options` and try the step above again.

3. Review the contents of the generated HTML page in a browser, and make edits upstream in the PR descriptions.

3. Generate again, this time without the `review` flag. Remember the `branches` argument if applicable.

    ```
    node changelog/generate
    ```

4. Optionally, make edits to the generated markdown files that could not be done upstream.

5. Run the script that assembles the content of all markdown files in to a HTML file and uploads it to S3, where the website will pick it up. If testing, run `node changelog/generate-html` first.

    ```
    node changelog/upload
    ```
