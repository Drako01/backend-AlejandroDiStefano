FROM node

COPY . .

RUN npm install

#Solve the problem reinstaling bcrypt

RUN npm uninstall bcrypt

RUN npm i bcrypt

EXPOSE 8080

CMD ["npm", "start"]

