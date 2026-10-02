# Documentation

## Metadata and descriptions

- Include one `description` key in each document's YAML front matter.
  Files named `README.md` or `AGENTS.md` are exempt, regardless of capitalization.
- Preserve existing metadata such as `slug`, `title`, `sidebar_label`, and `tags`
  when adding or updating a description.
- When editing an article, compare its description with the final text and update
  it in the same change if the scope, instructions, or conclusions change.
- Write one concise description explaining what readers will learn or accomplish.
  Aim for roughly 25–40 words; prioritize accuracy over padding to meet the range.
- Support every claim with the article's text or examples. Preserve qualifications
  and limitations, and remove claims that the updated article no longer supports.
- Use plain, informative language. Avoid marketing language, keyword stuffing,
  and simply repeating the title. Keep descriptions free of Markdown formatting.

## Pages and links

- Register new articles in `docs/sidebars.js`, or add intentionally unlisted
  articles to `unlisted` in `docs/doc-config.js`.
- When moving or renaming a published page, add a redirect in `docs/doc-config.js`.
- Use absolute HTTPS links for documentation, API references, and samples.
  Same-page anchors and relative image paths are allowed; relative document links
  fail the link consistency check.

## Accuracy and examples

- Verify option names, defaults, and examples against the repository. State
  required modules and relevant version restrictions.
- Keep examples small and focused on the documented feature.

## Validation

- Run `npm run lint-docs` for spelling and `npx gulp test-docs` for link consistency
  from the repository root. Fix issues introduced by the change.
- Preview article changes involving layout, embedded demos, or MDX using
  `npm run preview-docs`.
