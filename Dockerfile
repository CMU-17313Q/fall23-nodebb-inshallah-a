FROM node:lts

# Install Python and other dependencies
RUN apt-get update && \
    apt-get install -y jq python3 python3-pip

# Set the working directory
RUN mkdir -p /usr/src/app && \
    chown -R node:node /usr/src/app
WORKDIR /usr/src/app

# Create a Python virtual environment and activate it
RUN python3 -m venv venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

# Upgrade pip to the latest version
RUN pip install --upgrade pip

# Copy your Python requirements file and install Python dependencies
COPY --chown=node:node career-model/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
COPY --chown=node:node package.json.docker /usr/src/app/package.json
RUN npm install && \
    npm cache clean --force

# Copy the rest of your application's source code
COPY --chown=node:node . /usr/src/app

# Set environment variables
ENV NODE_ENV=production \
    daemon=false \
    silent=false

# Expose the port your app runs on
EXPOSE 4567

# Give execution rights on the scripts
RUN chmod +x create_config.sh

# Run your setup script and then start NodeBB
CMD ./create_config.sh -n "${SETUP}" && \
    ./nodebb setup || node ./nodebb build; \
    python3 career-model/predict.py; \
    node ./nodebb start
