**Table of Contents**
- [Homemade Meals API Server](#homemade-meals-api-server)
  - [Run in local environment](#run-in-local-environment)
  - [Testing endpoints locally using REST Client](#testing-endpoints-locally-using-rest-client)

# Homemade Meals API Server

## Run in local environment
In local environment the runs on port 3010.

- Install app dependencies - node packages
  ```
  npm install
  ```
- Run app in dev mode (Auto loaded on file changes)
  ```
  npm run dev
  ```
  You should get following result
  ![dev-scipt](./docs/images/run-dev-script.png)

## Testing endpoints locally using REST Client
- Install REST Client Extension in VS Code
- Run app in dev mode
- Open any of the .http file and clik on send
  
  For example clicking on send reqest for "route of the api server"
  ![app_root_client](docs/images/api_root_client.png)
  would produce follwing result
  ![app_root_client_result](docs/images/api_root_client_result.png)

