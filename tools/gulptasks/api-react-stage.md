# React API documentation staging

The React static artifact is validated against the expected React and
Highcharts versions before any files are staged or uploaded. Its manifest and
inventory remain outside the public `build/api` tree. The artifact itself is
copied into `build/api` without changing file bytes.

When the legacy product `api.js` files are present, staging also adds a **React**
entry to their JS/iOS/Android dropdown. Each product links to its own
`/<product>/react/` root. Repeated staging keeps one entry. React artifact files
are unchanged.

## Stage after API generation

Pass the artifact to `api-docs` to stage it after the legacy API documentation
has been generated:

```sh
npx gulp api-docs \
  --react-artifact /path/to/react-static-artifact \
  --expected-react-version 5.0.1 \
  --expected-highcharts-version 13.1.1
```

To validate and stage an artifact without generating legacy API documentation,
run:

```sh
npx gulp api-react-stage \
  --react-artifact /path/to/react-static-artifact \
  --expected-react-version 5.0.1 \
  --expected-highcharts-version 13.1.1
```

`npx gulp api-react-stage --helpme` prints the task options.

## Dry-run publication

Use `--react-artifact` for publication as well as staging, so the legacy
navigation links and their React destinations are both published. A legacy-only
`api-upload` skips React files, even when they are already staged locally.
React publication completes before legacy uploads begin, so a failed React
publication does not publish navigation links to missing pages.

Run the normal API upload with `--dryrun` to exercise both legacy uploads and
React publication without contacting S3:

```sh
npx gulp api-upload \
  --bucket your-confirmed-api-bucket \
  --dryrun \
  --react-artifact /path/to/react-static-artifact \
  --expected-react-version 5.0.1 \
  --expected-highcharts-version 13.1.1
```

The legacy dry-run writes object files under `tmp/s3/<bucket>/` and `DELETE`
markers under `tmp/s3-delete-markers/<bucket>/`. Deletions remove the mirrored
payload, and uploading the key again clears its marker. Sync deletion markers
cover legacy paths only;
React-owned product paths, `react-assets/`, `react-data/`, and root artifact metadata are
excluded from legacy synchronization. The React publication report defaults
to `tmp/react-static-publication.json`; use `--react-report <path>` to choose
another location outside release content. The task checks that the
report destination can be written before any legacy or React upload. If both
publication and report writing fail, the upload error retains the report error
as `reportError`.

React files are uploaded as their inventoried bytes with the artifact's content
type and cache policy. Immutable keys use conditional writes; an existing key
is reused only when a remote HEAD check matches its size, SHA-256 metadata,
inventory SHA-256 metadata, content type, and cache policy. A mismatch stops
publication before any shell is uploaded. Run one publication at a time because
the product shells are mutable release pointers.

React publication is independent of `--docs` selection and always includes the
four product shells plus the shared assets and data. Immutable files are
uploaded before shell files. Publication never deletes previous React
releases or their assets/data.

The CDN rule for the first release must be scoped to the four product
`/react/` prefixes. Internally rewrite only prefix roots, `index.html`, and
eligible `.html` document requests to that product's shell while preserving
the browser URL and path case. Serve JSON and assets normally so missing files
return 404. Unknown document paths continue to return the shell with HTTP 200
for the initial slice. Do not add a blanket API-prefix rewrite.

## Rollback

Keep each validated artifact with its release record. To restore the shells
from a retained artifact, use `--react-shells-only`:

```sh
npx gulp api-upload \
  --bucket your-confirmed-api-bucket \
  --dryrun \
  --react-artifact /path/to/retained-react-static-artifact \
  --expected-react-version 5.0.1 \
  --expected-highcharts-version 13.1.1 \
  --react-shells-only
```

This validates the retained artifact and publishes its shells while skipping
the legacy upload and sync. It leaves immutable assets and data in place.
The live rollback path first checks that all referenced immutable objects still
exist remotely with matching metadata. A dry run of shell rollback also needs
matching immutable payload files from an earlier dry run under
`tmp/s3/<bucket>/`.

Before removing `--dryrun` for a production release, confirm the bucket and
publish command, backend CI artifact delivery, CDN owner and scoped rewrites,
release retention policy, and Cookiebot/GTM ownership. These examples do not
perform an S3 or CDN publication.
