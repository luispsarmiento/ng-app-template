# Mt ToDo App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Tailwindcss configuration
To get more help about tailwind configuration go check out [Configuration](https://tailwindcss.com/docs/configuration).

## Docker
**Each new dependency that is required should be added to package.json and the docker image should be rebuilt**.

To build the image run `docker build -t mt-todo-app:dev -f dev.Dockerfile .`
To run a container run this command:
```bash
docker container run --rm --name dev-mt-todo-app -p 4200:4200 -v ${PWD}/src:/app/src mt-todo-app:dev
```
To run a container in Azure using Azure Container Instances, use the following command:
```bash
az container create --resource-group <your_rg> --cpu 1 --dns-name-label <your_app_name> --image <dockerhub_profile>/trello-clone:<label> --ip-address Public --location "West US 3" --memory 1.5 --name <your_app_name> --os-type Linux --protocol tcp --ports 80 --restart-policy Always
```
To run a container in Azure App Container, use the following command:
```bash
az containerapp create `
  --name <your_app_name> `
  --resource-group <your_rg> `
  --environment <your_env> `
  --image <dockerhub_profile>trello-clone:<label> `
  --target-port 80 `
  --ingress 'external'
  --cpu 0.25
  --memory '0.5Gi'
```
## Resources
- [unDraw](https://undraw.co/illustrations)
- [Response Design Tailwind](https://tailwindcss.com/docs/responsive-design)
- [Tailwind Forms](https://github.com/tailwindlabs/tailwindcss-forms)
- [Boilerplate Trello](https://gist.github.com/nicobytes/92f050c77c8c8e5be63e97c1ae0b9c83)
