# Homemade Meals - MERN Stack Project

## - by Hiren Gondhiya and Niraj Amatya

Deployed App: https://homemade-meals.netlify.app/

GitHub Organization: https://github.com/homemade-meals

Original Part A Documentation: https://github.com/homemade-meals/documentation

_Table of Contents_

- [Homemade Meals - MERN Stack Project](#homemade-meals---mern-stack-project)
  - [- by Hiren Gondhiya and Niraj Amatya](#ulliby-hiren-gondhiya-and-niraj-amatyaliul)
  - [Running Project Locally](#running-project-locally)
    - [Pre-requisite (MongoDB)](#pre-requisite-mongodb)
    - [Server](#server)
    - [Client](#client)
  - [Cloud Deployment and Environment Variables](#cloud-deployment-and-environment-variables)
    - [Server](#server-1)
    - [Client](#client-1)
  - [Test Results](#test-results)

## Running Project Locally

### Pre-requisite (MongoDB)

To run project locally MongoDB must be installed and running locally on default port 27017. At the time of development of application the app was run on MongoDB Community Edition Version 4.2.6

Detailed instructions for installing and executing MongoDB can be found on [MongoDB Website](https://docs.mongodb.com/manual/installation/)

### Server

- Clone repo
  ```
  git clone https://github.com/homemade-meals/server.git
  ```
- Install packages
  We used npm while building our api server (express app) but you can use yarn as well.
  Below commands are for npm.
  ```
  npm install
  ```
- Run App
  ```
  npm start
  ```
  Api starts on port 3010 by default

### Client

- Clone repo
  ```
  git clone https://github.com/homemade-meals/client.git
  ```
- Install packages
  We used yarn while building our react client but you can use npm as well.
  Below commands are for npm.
  ```
  yarn install
  ```
- Run App
  ```
  yarn start
  ```
  App starts on port 3000 by default.

## Cloud Deployment and Environment Variables

### Server

The api server is hosted on Heroku at https://homemade-meals-server.herokuapp.com/
It needs URL of MongoDB which is configured by environment variable MONGODB_URI

Our MongoDB instance is hosted on MongoDB Atlas

### Client

The react client is hosted on Netlify at https://homemade-meals.netlify.app/
It needs URL of api server, which is configured by environment variable REACT_APP_MEALS_API

## Test Results

- Automated Development Tests (Mocha & Supertest)
  https://github.com/homemade-meals/server/tree/master/testResults
- Automated Integration Tests (Cypress)
  https://dashboard.cypress.io/projects/p36wam/runs
- Production Test Results (Manual Tests)
  https://github.com/homemade-meals/client/tree/master/docs/manualTesting
- CI Unit Test Results (GitHub Actions)
  1. https://github.com/homemade-meals/server/actions
  2. https://github.com/hirengondhiya/homemade-meals-server/actions
  3. https://github.com/Niraj-Amatya/server/actions
