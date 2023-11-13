# Start with a Python base image that matches your local Python version
FROM python:3.11.5

# Install Node.js in addition to Python
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Set the working directory and create if doesn't exist
WORKDIR /usr/src/app

# Create a Python virtual environment and activate it
RUN python -m venv venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

# Upgrade pip to the latest version
RUN pip install --upgrade pip

# Copy your Python requirements file and install Python dependencies
COPY career-model/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
COPY package.json.docker /usr/src/app/package.json
RUN npm install && \
    npm cache clean --force

# Copy the rest of your application's source code
COPY . .

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
    python career-model/predict.py; \
    node ./nodebb start
