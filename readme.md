![](https://media-exp1.licdn.com/dms/image/C560BAQELEUuyn6i3FQ/company-logo_200_200/0/1622682048053?e=2147483647&v=beta&t=FXjzqnbrfme94w4etc6owZaTJibT_9d94p98uispw8s)

# Backend Skill Assesment

👋 Codebase for the Ilume backend skill assesment test

## 🧐 Assumptions
- Each dog will only have one owner
- Each dog will be one breed
- DOB cannot be in the future
- DOB can be any date in the past

## 🌈 How to run the code

1. [Install nodejs](https://nodejs.org/en/download/) on your system.
2. Run `npm install` to install dependencies.
3. Take a copy of `.env.example` and rename it to `.env`. Update the `MONGO_URI` and `TOKEN_KEY` with a mongo db uri and a random string respectively.
4. Run `npm start` to run the server. The server should start on `http://localhost;8080`. You should see a `Welcome 🙌` on the home route. You should be able to test all the api's from the postman collection below.

## 💽 How to seed the database
1. After setting up the project, run `ts-node src/seed/breed.ts` to seed the Breed types into the database.

## 🚀 API Documentation

The api documentation is hosted as a postman collection.


## 🐛 Known Bugs
- For some errors, the apis return a generic error message such as `Unable to <task>. Please check logs.` These can be better wrapped into pre-defined error categories.