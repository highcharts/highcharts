import { join } from 'node:path';
import {
    candidateFiles, hash, recordCandidateEvidence, sha256, writeJSON
} from '../../nightly-package-validation-prototype/package-evidence.mjs';

export function writeCandidateProvenance(root, packageName, identity, contents, buildAttempt = identity.attempt) {
    const candidate = join(root, 'candidate');
    const files = Object.keys(contents).sort().map(name => [name, sha256(contents[name])]);
    const directorySha256 = sha256(JSON.stringify(files));
    const tarball = 'candidate.tgz';
    const archive = join(candidate, tarball);
    const tarballSha256 = hash(archive);
    const integrity = `sha512-${hash(archive, 'sha512', 'base64')}`;
    const { sourceSha, runId, attempt } = identity;
    const { version } = JSON.parse(contents['package.json']);
    if (candidateFiles(packageName, 'nightly').includes('candidate/staging-manifest.json')) {
        writeJSON(join(candidate, 'staging-manifest.json'), {
            sourceSha,
            runId,
            attempt,
            package: packageName,
            version,
            packageManifestSha256: sha256(contents['package.json']),
            packedFiles: Object.keys(contents),
            stagedFiles: files,
            stagedInventorySha256: directorySha256,
            tarball,
            tarballSha256,
            integrity
        });
    } else {
        writeJSON(join(candidate, 'build-manifest.json'), {
            sourceSha, runId, buildAttempt, files, directorySha256
        });
        writeJSON(join(candidate, 'pack.json'), [{
            name: packageName,
            version,
            filename: tarball,
            integrity,
            files: Object.keys(contents).map(path => ({ path }))
        }]);
    }
    recordCandidateEvidence(root, packageName, identity);
    return hash(join(candidate, 'provenance.json'));
}
