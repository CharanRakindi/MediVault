# Deploy Clinova

**Supported production path: Amazon Web Services (Lightsail or EC2) + Docker Compose.**

Full guide (step-by-step): **[DEPLOY-AWS.md](./DEPLOY-AWS.md)**

```
Internet → :80/:443 → web (nginx SPA)
                          ↳ /api, /socket.io, /health → api :5001
                                                       → mongo (Docker volume)
```

This is the same stack as local:

```bash
docker compose --env-file .env.docker up --build -d
```

---

## Quick links

| Doc | Contents |
|-----|----------|
| [DEPLOY-AWS.md](./DEPLOY-AWS.md) | Lightsail, EC2, HTTPS, bootstrap script, troubleshooting |
| [../scripts/aws-bootstrap.sh](../scripts/aws-bootstrap.sh) | Install Docker on Ubuntu and prep `.env.docker` |
| [../.env.docker.example](../.env.docker.example) | Env template for compose |

---

## Minimal production env (`.env.docker`)

```env
CLIENT_URL=http://YOUR_PUBLIC_IP
# or https://app.yourdomain.com after TLS

WEB_PORT=80
JWT_ACCESS_SECRET=<long-random-32+>
JWT_REFRESH_SECRET=<another-long-random>
COOKIE_SECURE=false
# set true when using HTTPS
COOKIE_SAMESITE=lax
```

---

## Continuous deploy (manual only)

After the first on-server deploy, add GitHub secrets (`DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`).  
Then ship or roll back via **Actions → Deploy → Run workflow** (optional `ref` = branch / tag / SHA). **No auto-deploy on push.**

Full steps: **[DEPLOY-AWS.md → Continuous deploy](./DEPLOY-AWS.md#continuous-deploy-github-actions--ssh-manual-only)**

---

## After deploy

1. Open `http://YOUR_PUBLIC_IP`  
2. Seed demo data if needed (see AWS guide)  
3. Put the public URL in the root README **Live demo** section  
4. (Optional) Wire CD secrets and use **Run workflow** when you want to update AWS  
