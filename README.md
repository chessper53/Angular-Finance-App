# Angular-Finance-App
Pretty straightforward financial application that facilitates transactions between accounts. 
It utilizes a database as a server to store and retrieve financial data.
The app allows users to conduct transactions but also provides visual representations of expenses and profits through various [charts](https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-vertical).

# Project Setup
## Angular Material Modules
Add these in the normal Directory:
```bash
ng add @angular/material
```
## Other Dependencies
Add these in the Client Directory:
```bash
npm install --save @angular/forms
npm install --save @angular/router
npm install --save @angular/platform-browser
npm install --save @angular/platform-browser-dynamic
npm install --save @angular/animations
npm install --save @angular/common
npm install --save @angular/core
npm install --save @angular/compiler
npm install --save @angular/http
npm install --save rxjs
npm install --save @swimlane/ngx-charts
```


## Running the Client
Open a terminal and navigate to the /Client/ directory.
Run the following command:
```bash
npx ng serve --open
```
This will start the Angular development server and automatically open the project in your default web browser.

## Running the Server
Open a separate terminal and navigate to the /Server/ directory.
Run the following command:
```bash
npm run start
```

