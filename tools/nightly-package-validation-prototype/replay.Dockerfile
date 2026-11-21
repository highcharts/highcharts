FROM node:26.13.0-bookworm@sha256:1d9e3c29bf8eae6becc330e2546d461b23c1a86ac9207d015b5ea8ba26cbe210 AS toolchain
FROM mcr.microsoft.com/playwright:v1.61.1-noble@sha256:cf0daee9b994042e011bc29f20cdff1a9f682a039b43fcd738f7d8a9d3bcd9d6
COPY --from=toolchain /usr/local/ /usr/local/
COPY --from=toolchain /usr/bin/unzip /usr/bin/unzip
USER pwuser
WORKDIR /home/pwuser
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund --cache /home/pwuser/replay-cache && rm -rf node_modules
