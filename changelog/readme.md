## Workflow of generating a changelog
1. Run the `generate-changelog.js` script which copies commit messages since the last release in to markdown files for each product.


```
cd changelog
node generate-changelog --since vX.X.X
```

3. Manually edit these generated markdown files to your wish.

4. Run `generate-changelog-html.js` which assembles the content of all markdown files in to a .html file.

```
node generate-changelog-html changelog
```

5. Publish the generated .html file on  the website.