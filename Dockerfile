# ---------- FRONTEND BUILD ----------
FROM node:20-alpine AS frontend-build
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build

# ---------- BACKEND ----------
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV ENV=online
ENV PORT=8080

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend .

# copy frontend build into backend
COPY --from=frontend-build /frontend/dist ./frontend/dist

EXPOSE 8080

CMD ["node", "src/index.js"]
