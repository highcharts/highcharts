## Workflow of generating a changelog
1. Run the `generate-changelog.js` script which copies commit messages since the last release in to markdown files for each product.

    ```
    node changelog/generate --since vX.X.X
    ```

3. Manually edit these generated markdown files to your wish.

4. Run the script that assembles the content of all markdown files in to a .html file.

    ```
    node changelog/generate-html
    ```

5. The generated `changelog.html` is committed to the _highcharts_ repo and will be picked up by the web server.