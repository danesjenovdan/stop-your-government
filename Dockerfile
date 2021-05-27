# ---
# build stage image
# ---
FROM node:14-alpine as build

# set current directory
WORKDIR /app

# install dependencies
COPY package.json yarn.lock ./
RUN yarn

# copy all files and run build
COPY . .
RUN yarn build

# ---
# actual image
# ---
FROM node:14-alpine

# set current directory
WORKDIR /app

# install production dependencies only
COPY package.json yarn.lock ./
ENV NODE_ENV=production
RUN yarn && yarn cache clean

# copy all needed files from build stage image
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["yarn", "start"]
