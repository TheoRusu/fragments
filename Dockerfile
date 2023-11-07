# This is a Dockerfile. Tis defines a set of instructions used by the Docker Engine to create a Docker Image.

# Stage 0: install the base dependencies
FROM node:16.10.0-alpine3.14 AS dependencies

ENV NODE_ENV=production

LABEL maintainer="Theo Rusu trusu1@myseneca.ca"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm ci --production

# Copy src to /app/src/
COPY ./src ./src

# Copy src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD ["npm", "start"]


HEALTHCHECK --interval=3m CMD curl --fail https://localhost:${PORT}/ || exit 1

# We run our service on port 8080
EXPOSE 8080