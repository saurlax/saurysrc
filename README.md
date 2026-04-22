# SaurySRC

SaurySRC is an open source platform to quickly set up a security response center (SRC) for managing vulnerabilities and incident reports.

# Docker

## Build

```bash
docker build -t saurysrc .
```

## Run

```bash
docker run -d --name saurysrc -p 3000:3000 -e NUXT_SESSION_PASSWORD=password-with-at-least-32-characters -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal/saurysrc saurysrc
```
