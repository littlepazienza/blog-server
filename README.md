[![Build Status](https://github.com/littlepazienza/blog-server/actions/workflows/main.yml/badge.svg)](https://github.com/littlepazienza/blog-server/actions/workflows/main.yml)

# Blog Server – Node.js / Express Backend

Light-weight REST API that powers the *Pazienza Chronicle* blog.  
Written in **TypeScript + Express.js** and backed by **MongoDB**.

> **TL;DR**  
> ```bash
> # Start dev server (hot-reload)
> npm install
> npm run dev
> ```

---

## Features

* CRUD endpoints for blog posts  
  * `GET /manage/all` &nbsp;– list posts  
  * `GET /:id` &nbsp;– fetch single post  
  * `POST /manage/add` &nbsp;– create post with up-to-5 images
* Multer-based image upload (stored in `uploads/blog-images`)
* CORS enabled for `http://localhost:4200`
* Health-check endpoint for container orchestration

## Requirements

* **Node >= 18** (LTS)  
* **MongoDB** running at `mongodb://localhost:27017/ienza-tech`

> The container image does **not** bundle MongoDB; it expects an external
> instance (docker-compose / Atlas / your own cluster).

## Local Development

```bash
# 1. Install dependencies
npm ci

# 2. Start the API with nodemon & TS support
npm run dev

# Server available at http://localhost:34001
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT`   | HTTP port   | `34001` |
| `MONGO_URI` | Mongo connection string | `mongodb://localhost:27017/ienza-tech` |

Create a `.env` file to override.

## Docker

Build the production image:

```bash
docker build -t benjaminpazienza/blog-server:latest .
```

Run the container:

```bash
docker run -d --name blog-server \
  -p 34001:34001 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/ienza-tech \
  benjaminpazienza/blog-server:latest
```

Health-check:  
`GET /manage/all` must return `200`.

## Continuous Delivery

GitHub Actions workflow **.github/workflows/main.yml**:

1. Triggers on every push to `main`  
2. Builds the Docker image using the `Dockerfile` in this repo  
3. Tags & pushes to Docker Hub **benjaminpazienza/blog-server**  

Secrets required:

* `DOCKER_USERNAME`
* `DOCKER_PASSWORD`

---

### Folder Structure

```
blog-server
├── server.js          # Entry-point
├── package.json
├── Dockerfile
├── uploads/           # Image uploads (created at runtime)
└── .github/workflows/ # CI pipeline
```

## License

MIT © Ben Pazienza