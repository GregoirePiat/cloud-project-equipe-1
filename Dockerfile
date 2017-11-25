FROM node:9.1.0-alpine

# Set a working directory
WORKDIR /usr/src/app

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Run the container under "node" user by default
USER node

# Set env variable
ENV NODE_ENV production

EXPOSE 3000

CMD ["node", "bin/www" ]