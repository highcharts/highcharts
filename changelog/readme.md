# Changelog

## Writing content for the changelog

Please refer to [Contributing: Writing content for the changelog](../CONTRIBUTING.md#writing-content-for-the-changelog).

## Workflow of generating the changelog

1. Run the script that copies PR descriptions since the last release into markdown files for each product. When including feature branches (typically on minor/major releases), remember to add the `branches` argument: `--branches master,v11`. Since Highcharts Dashboards releases aren't in sync with the rest of packages, to generate only the Dashboards changelog, use the `--highchartsDashboards` flag and `--release x.x.x` to specify the version number of the Highcharts Dashboards release.

    ```
    node changelog/generate --review
    ```

    or
    ```
    node changelog/generate --highchartsDashboards --release 2.0.0
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
