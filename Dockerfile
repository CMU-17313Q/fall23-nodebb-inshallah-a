# Use the official Python image.
FROM python:3.9-slim

# Set the working directory in the container.
WORKDIR /usr/src/app

# Copy the Python requirements file into the container.
COPY career-model .

# Install the Python dependencies.
RUN pip install --no-cache-dir -r career-model/requirements.txt

# Copy the rest of the application source code into the container.
COPY career-model/predict.py .

EXPOSE 8000

# Command to run the application.
CMD ["python3", "predict.py"]
