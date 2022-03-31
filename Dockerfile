ARG PORT=3000
FROM node:14-alpine
# Use /app as the CWD
WORKDIR /app  
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN export PATH="$PATH:/usr/local/bin/python3"
# Copy package.json and package-lock.json to /app
COPY package*.json ./   
# Install all dependencies
RUN npm i               
# Copy the rest of the code
COPY . .                   
# Open desired port
EXPOSE ${PORT}
# Set node environment to production
ENV NODE_ENV production
# Install PM2
RUN npm i -g pm2
# Open desired port
EXPOSE ${PORT}
# Use PM2 to run the application as stated in config file
ENTRYPOINT ["pm2-runtime", "./process.yml"] 