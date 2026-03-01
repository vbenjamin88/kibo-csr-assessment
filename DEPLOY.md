# Deploy Frontend to Vercel

Deploy the Kibo CSR frontend to Vercel with automatic updates on git push.

---

## Prerequisites

- GitHub repo pushed: https://github.com/vbenjamin88/kibo-csr-assessment
- Backend API deployed somewhere (Railway, Render, Fly.io, etc.) — the frontend needs this URL

---

## Steps

### 1. Import project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your repo: `vbenjamin88/kibo-csr-assessment`

### 2. Configure the project

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `src/frontend` |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `dist` (default) |

### 3. Environment variable (required when backend is elsewhere)

Add an environment variable:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend-url.railway.app/api` |

Replace with your actual backend API base URL (including `/api`).

### 4. Deploy

Click **Deploy**. Vercel will build and deploy. Future pushes to `main` will auto-deploy.

---

## Local development

- Leave `VITE_API_URL` unset — the app uses `/api` and the Vite proxy to `localhost:5000`
- Or set it to point at a deployed backend for testing

---

## CORS

Ensure your backend allows the Vercel domain (e.g. `https://your-app.vercel.app`) in CORS. The .NET backend may need:

```csharp
// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://your-app.vercel.app", "http://localhost:3000")
              .AllowAnyMethod().AllowAnyHeader();
    });
});
```
