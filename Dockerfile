# Use the official lightweight Node image
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev        # faster install for production
COPY . .
RUN npm run build            # generates /app/dist
# Serve with a tiny static server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "8080"]
EXPOSE 8080
