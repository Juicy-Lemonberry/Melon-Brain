FROM node:18.16.1

WORKDIR /app

# Install dependencies...
COPY package*.json ./
RUN npm install

# Then bundle app source
COPY . .

# Build the Next.js application
RUN npm run build

# Execute docker container..
EXPOSE 3000
CMD ["npm", "run", "dev"]