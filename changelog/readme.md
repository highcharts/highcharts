## Writing content for the changelog
The changelog is generated from PR descriptions. The following rules apply:
* All PRs that should go into the changelog must be labeled with either 
`Changelog: Feature` or `Changelog: Bugfix`. Everything else is ignored.
* Label the PR with `Product: Highstock`, `Product: Highmaps` etc. for specific
products. PRs with no product tags go into the Highcharts changelog.
* Only the first paragraph of the description is used. Anything below the first
line break `\n` is removed.
* Since the PR descriptions are not commit messages, we don't need auto-closing
syntax like "Fixed #XXX" or "Closed #XXX". PR descriptions should contain a
reference to the issue, but the changelog can now be written in a more natural
language.


## Workflow of generating the changelog
1. Run the `generate-changelog.js` script which copies PR descriptions since the last release into markdown files for each product.

    ```
    node changelog/generate --pr
    ```

3. Manually edit these generated markdown files to your wish.

4. Run the script that assembles the content of all markdown files in to a .html file.

    ```
    node changelog/generate-html
    ```

5. The generated `changelog.html` is committed to the _highcharts_ repo and will be picked up by the web server.
