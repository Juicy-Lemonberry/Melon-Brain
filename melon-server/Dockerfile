FROM node:18.16.1

WORKDIR /app

# Install dependencies...
COPY package*.json ./
RUN npm install

# Then bundle app source
COPY . .

# Execute docker container..
EXPOSE 5000
CMD ["npm", "start"]