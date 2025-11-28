#!/bin/bash

echo "node_modules" > ../../.containerignore

podman build -t paprize-snapshot-runner -f - ../../ <<'EOF'

FROM mcr.microsoft.com/playwright:v1.56.1-jammy
WORKDIR /tests

COPY . .

RUN corepack enable

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

CMD ["pnpm", "run", "test:snapshot"]

EOF

rm ../../.containerignore
podman run --rm paprize-snapshot-runner