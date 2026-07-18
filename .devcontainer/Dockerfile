FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

RUN apt-get update && apt-get install -y \
    git \
    curl \
    ca-certificates \
    jq \
    bubblewrap \
    && rm -rf /var/lib/apt/lists/*

# System libraries Chromium needs to run under Playwright. Installed here,
# as root, at build time — never at runtime, so the "node" user never needs
# sudo/apt access. install-deps asks Playwright itself which packages this
# base image needs, rather than us hardcoding a package list that could
# drift out of date with Debian's package names.
RUN npx --yes playwright@latest install-deps chromium \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
RUN npm i -g @anthropic-ai/claude-code@latest

# The claude-home volume mounts here. If this dir doesn't exist with the
# right owner *before* the volume is first populated, Docker creates the
# mount point as root — and the node user can never write credentials into
# it. Must be done as root, before USER node.
RUN mkdir -p /home/node/.claude && chown -R node:node /home/node/.claude

USER node
WORKDIR /workspaces/alchemy