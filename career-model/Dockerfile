FROM python:3.8-slim

WORKDIR /app

# install packages
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Install Gunicorn for serving 
RUN pip install gunicorn

# Copy the current directory contents into the container at /app
COPY . /app

# Use 8000 port
EXPOSE 5000

# Use gunicorn to run the app
CMD ["gunicorn", "-b", "0.0.0.0:5000", "main:app"]
