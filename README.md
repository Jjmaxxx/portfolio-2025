
# Portfolio 2025

You can see this project live at **[https://justinlee.dev/](https://justinlee.dev/)**

This repository contains the source code and deployment configuration for my personal portfolio site, built with **Next.js** and served via **NGINX** in Docker containers. Includes CD deployment to an **Oracle Cloud Infrastructure (OCI)** instance.

---

## Development

Run locally with:

```bash
docker compose -f docker-compose.dev.yml up
````

---

## Deployment

Deployment is handled automatically via **GitHub Actions** (`.github/workflows/deploy.yml`) when changes are pushed to the `main` branch:

1. SSH into the OCI instance.
2. Pull the latest changes from GitHub.
3. Run `runserver.sh` to rebuild and restart containers.

---