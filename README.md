# nestjs-todo-list-api

## About

This is an REST API implementation with NestJS + TypeORM for a simple Todo List app, based on [roadmap.sh's Todo List API](https://roadmap.sh/projects/todo-list-api) project, with the purpose of exploring both the framework and concepts such as:

- Authentication with JWT
- RBAC
- Serialization with [interceptors](https://docs.nestjs.com/interceptors#binding-interceptors)
- Error handling and HTTP codes
- TDD with Jest (Unit and E2E tests)
- Clean Architecture and SOLID principles

## Instructions

### Start app

```
$ npm i
$ npm run start
```

### Swagger docs

To access the API Swagger (interactive documentation) access http://localhost:3000/docs.

### Run tests

#### Code Coverage

> Ps: there are still many lines to cover with tests.

```
$ npm run test:cov
```

#### Unit Tests

```
$ npm run test
```

#### E2E Tests

```
$ npm run test:e2e
```
