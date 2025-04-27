FROM node:16.17.1

RUN mkdir /app

WORKDIR /app

COPY ["package.json", "package-lock.json", "angular.json", "tailwind.config.js", "tsconfig.app.json", "tsconfig.json", "tsconfig.spec.json", "ngsw-config.json", "tsconfig.worker.json", "/app/"]

RUN npm cache clean --force
RUN npm install --force

COPY ["src/", "/app/src/"]

EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "500"]
