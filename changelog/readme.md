## Workflow of generating a changelog
1. Run the generate-changelog.js script which copies commit messages since the last release in to markdown files for each product.
Example: 
```node node generate-changelog --since v6.1.1```

3. Manually edit these generated markdown files to your wish.

4. Run generate-changelog-html which assemble the content of all markdown files in to a .html file.
Example:
```node generate-changelog-html.js testChangelog```

5. Publish the generated .html file on  the website.