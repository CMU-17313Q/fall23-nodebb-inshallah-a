FROM node:lts

# Install Python and other dependencies
RUN apt-get update && \
    apt-get install -y jq python3 python3-pip

# Set the working directory
RUN mkdir -p /usr/src/app && \
    chown -R node:node /usr/src/app
WORKDIR /usr/src/app

# Install Node.js dependencies
COPY --chown=node:node package.json.docker /usr/src/app/package.json
RUN npm install && \
    npm cache clean --force

# Copy your Node.js application
COPY --chown=node:node . /usr/src/app

# Set environment variables
ENV NODE_ENV=production \
    daemon=false \
    silent=false

# Expose the port your app runs on
EXPOSE 4567

# Give execution rights on the scripts
RUN chmod +x create_config.sh

# Assuming your Python script doesn't need to keep running like a server
# and just needs to be executed once during the container startup,
# you can run it before starting your Node.js application.

CMD ./create_config.sh -n "${SETUP}" && \
    ./nodebb setup || node ./nodebb build; \
    python3 career-model/predict.py; \
    node ./nodebb start
