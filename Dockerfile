FROM node:18-alpine
WORKDIR /usr/src/app
ENV NEXT_PUBLIC_API_BASE_URL=Muerde-backend-env.eba-3vftppzs.us-east-1.elasticbeanstalk.com
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]