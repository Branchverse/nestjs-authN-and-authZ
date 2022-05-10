# AuthN/AuthZ/RoleGuards

This is a repository with a basic user management system using cookies/jwtGuard/localGuard/Public-routers etc.
---

## Structure

- [Auth Module](src/auth/)
  - Contains all endpoints needed to register/login and logout a user.
  - `TODO: Refresh Token`
- [User Module](src/users/)
  - Contains endpoints to manipulate user data.
  - `TODO` The Role guard prevents any non admin to use these endpoints.
## Guards

- [JwtAuthGuard](src/auth/strategies/jwt.strategy.js): 
  - Is set globally in [app.module](src/app.module.ts), to overwrite the [@Public()](src/auth/guards/public.guard.ts) Decorator is used.
  - On login `cookie` with jwt based on `secretKey(.env)` and user data is created.
  - On Guarded requests, checks database if user with id provided by the token exists in database and authorizes request.
  - On logout `cookie` with jwt token is replaced with an empty cookie.
- [OptionalJwtAuthGuard](src/auth/guards/optionalJwtAuth.guard.ts)
  - Gives the possibility to add the user to the request if it exists but also allows non users
- [LocalAuthGuard](src/auth/guards/localAuth.guard.ts)
  - Guard used on login where no jwt is present, can be adjusted but uses email and password 
- [PublicGuard](src/auth/guards/localAuth.guard.ts)
  - If used revokes the global `JwtAuthGuard`, if other Guards are used with `@UseGuards()` unless they also have `canActivate` overriden, will apply
- [RoleGuard](src/auth/guards/role.guard.ts)
  - Can be used to allow endpoints for only certain roles.

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## About Nestjs

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
