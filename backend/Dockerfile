FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# If geocoder-data/ is already downloaded locally (npm run geocoder:download),
# it will be copied via COPY . . above.
# If not - download during build.
ENV GEOCODER_DUMP_DIR=/app/geocoder-data
RUN if [ ! -f /app/geocoder-data/cities1000.txt ]; then \
      echo "[Geocoder] Downloading GeoNames data..." && \
      node -e " \
        const g = require('local-reverse-geocoder'); \
        g.init({ \
          load: { admin1: true, admin2: true, admin3And4: false, alternateNames: false }, \
          dumpDirectory: process.env.GEOCODER_DUMP_DIR \
        }, function(err) { process.exit(err ? 1 : 0); }); \
      "; \
    else \
      echo "[Geocoder] Using pre-downloaded data."; \
    fi

EXPOSE 3000

CMD ["node", "dist/src/server.js"]
