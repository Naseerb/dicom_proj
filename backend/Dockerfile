# Option 1: Using the Bullseye-based image
FROM node:18-bullseye-slim
# Option 2: Uncomment the following line to try with the original image
# FROM node:18-slim

WORKDIR /app
USER root

# Update and install dependencies
RUN apt-get update && \
    apt-get install -y \
      python3 \
      python3-pip \
      python3-dev \
      gcc \
      libjpeg-dev \
      zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy Python requirements and install them
COPY ./python/requirements.txt ./python/
RUN pip3 install --no-cache-dir -r python/requirements.txt

# Install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 5005

CMD ["node", "server.js"]
