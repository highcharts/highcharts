## Writing content for the changelog
The changelog is generated from PR descriptions. The following rules apply:
* All PRs that should go into the changelog must be labeled with either
`Changelog: Feature` or `Changelog: Bugfix`. Everything else is ignored.
* Label the PR with `Product: Highstock`, `Product: Highmaps` etc. for specific
products. PRs with no product tags go into the Highcharts changelog.
* Only the first paragraph of the description is used. Anything below the first
line break `\n` is removed (except upgrade notes).
* Upgrade notes are marked with `#### Upgrade note`, then the _next paragraph_ after
this will be parsed as an upgrade note into the changelog.
* For consistency, bug fixes should start with "Fixed #xxxx".
* Since the changelog refers to changes that were done by a past release, write
in past tense.
* Describe bug fixes in a way that users recognize and can relate to their issue. It should describe the bug it fixes, rather than (or in addition to) describing the internals of how it was fixed.
* Names of API members should be written with code formatting.
    * Bad: Fixed issue with dataGrouping.
    * Good: Fixed issue with `dataGrouping`.
    * Good: Fixed issue with data grouping.


## Workflow of generating the changelog
1. Run the `generate-changelog.js` script which copies PR descriptions since the last release into markdown files for each product.

    ```
    node changelog/generate
    ```

3. Manually edit these generated markdown files to your wish.

4. Run the script that assembles the content of all markdown files in to a HTML file and uploads it to S3, where the website will pick it up. If testing, run `node changelog/generate-html` first.

    ```
    node changelog/upload
    ```
