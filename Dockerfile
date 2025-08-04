FROM node:18-alpine

# Add labels for better maintainability
LABEL maintainer="Ben Pazienza"
LABEL description="Lightweight Node.js backend for blog website"
LABEL version="1.0"

# Create app directory and set permissions
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S nodeapp && \
    adduser -S -G nodeapp nodeapp && \
    chown -R nodeapp:nodeapp /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install production dependencies.
# NOTE: `npm ci` is stricter about the lockfile version and fails on
# older/newer lockfile formats.  We use `npm install --omit=dev`
# for broader compatibility while still excluding dev-dependencies.
RUN npm install --omit=dev && \
    npm cache clean --force

# Copy application code
COPY . .

# Create uploads directory with proper permissions
RUN mkdir -p /app/uploads/blog-images && \
    chown -R nodeapp:nodeapp /app/uploads

# Switch to non-root user
USER nodeapp

# Set environment to production
ENV NODE_ENV=production

# Expose API port
EXPOSE 34001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:34001/manage/all || exit 1

# Start the server
CMD ["node", "server.js"]
