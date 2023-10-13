# Project adimunawar_betest

"This is a TypeScript application based on Node.js that includes controllers and services for user authentication and user operations. Here's a step-by-step guide on how to install and run this project."

## Installation

To run this project, ensure that you have Node.js and npm or yarn installed on your computer.

1. **Clone the Repository:**

   - Utilize the following command to clone this repository:

     ```bash
     git clone https://github.com/AdiMunawar31/adimunawar-betest.git
     ```

2. **Navigate to the Project Directory:**

   - Navigate to the project directory after cloning it:

     ```bash
     cd adimunawar_betest
     ```

3. **Install Dependencies:**

   - Install all project dependencies using npm or yarn:

     With npm:

     ```bash
     npm install
     ```

     Or with yarn:

     ```bash
     yarn
     ```

4. **Configure Environment Variables:**

   ```bash
   cp .env.development.local .env.production.local
   ```

## Running the Project

After installing the project and configuring the environment variables, you can execute it using the following commands:

- **Development Mode:**

  ```bash
  npm run dev
  ```

  Or with yarn:

  ```bash
  yarn dev
  ```

<br />

### With Docker

Note: It is assumed here that you have installed Docker and running in the background.

```bash
yarn docker:db
```

set `.env.development.local` file with your credentials.(like DB URL)

Run the app

```bash
yarn dev
```

<br />
<br />

### Route Documents

you can access swagger documentation at `http://localhost:5000/api-docs`

<br>

### Structure Project?

```
adimunawar_betest
├─ .github
│  └─ workflows
│     └─ tests.yml
├─ README.md
├─ ecosystem.config.js
├─ jest.config.js
├─ package.json
├─ src
│  ├─ __tests__
│  │  ├─ controllers
│  │  │    └─ auth.controller.test.ts
│  │  │    └─ users.controller.test.ts
│  │  ├─ services
│  │  │    └─ auth.service.test.ts
│  │  │    └─ users.service.test.ts
│  │  │    └─ token.service.test.ts
│  ├─ controller
│  │  └─ v1
│  │     ├─ auth
│  │     │  └─ auth.controller.ts
│  │     ├─ index.ts
│  │     └─ user
│  │        └─ user.controller.ts
│  ├─ app.ts
│  ├─ commons
│  │  ├─ constants
│  │  │  └─ index.ts
│  │  ├─ interfaces
│  │  │  ├─ user.crud.interface.ts
│  │  │  └─ timestamp.interface.ts
│  │  │  └─ token.interface.ts
│  │  │  └─ user.interface.ts
│  │  └─ types
│  ├─ configs
│  │  ├─ index.ts
│  │  └─ passport.ts
│  │  └─ redis.ts
│  ├─ dtos
│  │  ├─ auth
│  ├─ exceptions
│  │  └─ HttpException.ts
│  ├─ index.ts
│  ├─ middlewares
│  │  ├─ auth.middleware.ts
│  │  ├─ handlingErrors.middleware.ts
│  │  └─ validation.middleware.ts
│  ├─ models
│  │  ├─ tokens.model.ts
│  │  └─ users.model.ts
│  ├─ services
│  │  └─ v1
│  │     ├─ auth.service.ts
│  │     ├─ index.ts
│  │     ├─ token.service.ts
│  │     └─ user.service.ts
│  └─ utils
│     └─ toJSON.plugin.ts
├─ tsconfig.json
├─ tsconfig.jest.json
```
