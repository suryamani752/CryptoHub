#------------------stage 1---------------
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

#-----------------stage 2 --------------------
FROM node:18-apline AS Development
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 5173
CMD ["npm","run","dev","--","--host"] 
