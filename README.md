
# Xero Accounting Demo App

![alt text](https://raw.githubusercontent.com/grint/xero-demo/master/docs/logo2.png)

## Description

This is an application that can synchronize certain types of Xero lists and store them in a local database. The application is a prototype to **demonstrate the development approach**.

#### Rationale for the chosen principle of development
In the assignment, the stretch goal is to use GraphQL, which I have not had to work with yet. I have analysed the problem and considered 2 development approaches:

- Completely finished and ready for the production use application made with well-known technologies, but with the need for further processin (taking into account the desire to use GraphQL).
- Not completely finished application (taking into account the limited time), with the ability to learn new technology, show the level of learning in the real conditions and make a good basis for the further development.

I have chosen the 2nd option, as a result of which, after about 15 hours, I was able to use GraphQL at a pretty confident level. Here I also rely on my experience of the real development, according to which, all the planned technologies should be applied from the beginning - this can slow down the development at the initial stage, but eliminate the need to invest a large number of working hours in the future, which at the end result in success.

Thanks to this short assignment, I can show my usual way of working in conditions where it's necessary to quickly adapt to the requirements and new technologies and it's necessary to master new principles of development, a new language or architecture in the shortest possible time.

## Features

### Front-end stack
- [React](https://facebook.github.io/react) for UI.
- [Apollo Client](http://dev.apollodata.com/react) for connecting to GraphQL.
- [i18next](https://www.npmjs.com/package/i18next) for multi-language support (as Canada has 2 official languages).
- [Twitter Bootstrap](https://getbootstrap.com) for design and prototyping.
- [Sass](https://sass-lang.com/), and [PostCSS](https://postcss.org).
- [React Router](https://reacttraining.com/react-router) for declarative browser + server routes.
- OAuth for authorisation.
- ...and many others.

### Server-side 
- [Express.js](https://expressjs.com) web server.
- [Knex.js](http://knexjs.org) for data management
- [SQLite](https://www.sqlite.org/index.html) for data storage.
- [Webpack](https://webpack.js.org) for building.
- [TypeScript](https://www.typescriptlang.org) as my language of choice to use across the entire project. 
- ...and many others.

## How to use

### Prerequisites
- [yarn](https://yarnpkg.com/lang/en/docs/install)
- Node.js 6.x or higher (Node.js 10 is highly recommended)

### Quick start
```
git clone https://github.com/grint/xero-demo.git
cd xero-demo
yarn
yarn watch
```
or

```
git clone https://github.com/grint/xero-demo.git
cd xero-demo
yarn build
yarn start
```
The server application will be running on [http://localhost:3000], while the client application will be running on
[http://localhost:8080]. 

## Design Patterns
Considering the appropriate patterns, I answered to the question "What problem am I trying to solve?". In the task of the data synchronization with the possible introduction of new types of lists, I see the following problems:

- it should be possible to receive lists from various enpoints of various types (Account, Vendor, etc) with a different structure (Created date, Due date), i.e. the same construction process should be able to create different representations. In other words, by creation of a list, the process of its creation is not important, but the result is. **Factory design pattern** will do this job well;

- it should be possible to synchronize all the lists used in the system, i.e. there's a need of an easier or simpler interface to work with. In other words, when one clicks the "sync" button, the user does not need to synchronize each list individually and write logs, instead, the application must complete everything what is necessary. **Facade pattern** can solve this problem.

So, the combination of Factory and Facade pattern should be used. Factory will create lists of any type and the Facade will provide a common interface for syncing.

Also, when synchronizing the lists, data flows through a sequence of steps, which can be described by a simple algorithm:
- send a Xero request to the selected endpoint,
- get an answer,
- evaluate the status of the response
- if successful, save data to the database
- if necessary, process the data (depending on the type and design of the database and the list structure)
- if error - show alert to user
- create a log entry

This process is a non-linear pipeline. In terms of GoF patterns, this process can be described as a combination of **strategy and builder patterns**. This will let to choose a model of behavior depending on the status of the response.


### Database

The initial database choice was MongoDB 4.0, the choice of which is justified below. But for the purpose of more practice with SQL and also considering that the application is a demonstration of the development approach, I settled on SQLite. 

In production of such an application however, there are reasons to choose MongoDB:

The format of the data received from Xero is not the same: for example, the Accounts list can have a "CurrencyCode" field if it's a bank account, or Bank Transactions has a "Reference" field for SPEND and RECEIVE transactions. There are also country-dependend fields like "Narrative" for UK. Therefore, the data is not structured in the same way.

The application receives data in JSON format, which will let to immediately insert new documents without processing them, because NoSQL is a very good fit for hierarchical data storage in the form of key-value pairs. In the case of SQL, due to the presence of many links to additional lists like TaxType or Class, it would be necessary to split the data into several entities in order to avoid denormalization, and to write to several tables - this is the additional operations that can be avoided with NoSQL. Also, since Xero is the **source of truth**, the best solution is to avoid any data transformation, during which there is a risk of making changes.

Although the requirements for the application stated that we probably don’t need the entire set of properties it has, there is always the possibility of new requirements or expanding the application, which will lead to the need for significant changes to the design of the database. In the case of saving all the data, we can only show what is needed at the moment, and, if necessary, display new fields easily and quickly. Since NoSQL is easily scalable, in the case of a significant increase in the number of users and, accordingly, data, it's easy to scale.

An additional advantage of an unstructured data format is the ability to create a data-driven application.

As we are talking about accounting, an important aspect is the security and safety of data transfer. Despite the fact that at the moment the application only shows data, the possibility of making a decision on expanding the functionality and providing users with the opportunity to edit data is not excluded. In this case, ACID compliance is a must and SQL is a great choice, but since version 4 MongoDB also supports Multi-Document ACID Transactions, which makes the both ways a good fit.

NoSQL it is not a good option to manipulate complex queries, but in this application the most operations will be simple CRUD operations that do not require complex calculations, therefore, there is no need to support them.

## Architecture and Implemented Modules

### Project Structure

The project structure presents generally accepted guidelines and patterns for building scalable web and mobile
applications.The  functionality is grouped primarily by feature rather than by file type.

```
├── config                      # Various application configurations
├── modules                     # All the project modules
├── packages                    # Packages
│   ├── client                  # React UI
│   ├── common                  # Common code
│   ├── mobile                  # React Native 
│   ├── server                  # Node.js and Express server
```

Inside `modules`, you'll find all the  modules that are used for accomplishing the task. 
```
├── modules                       # Available modules
│   ├── vendor                    # The vendor module
│   │   ├── client                # Functionality for React app
│   │   └── server-ts             # Functionality for Express server
```

```
├── vendor                        # Vendor module
│   ├── client                    # The client module of the package
│   │   ├── components            # Can be also called "View" part of MVC
│   │   ├── containers            # Can be also called "Controllers" part of MVC
│   │   ├── graphql               # GraphQL types, queries, subscriptions and mutations
│   │   └── locales               # Multi-language translations
│   ├── server-ts                 # The server part of the module
│   │   ├── migrations            # Database schemas
│   │   ├── seeds                 # Demo data for quick demonstration and testing
│   │   ├── resolvers.ts          # GraphQL resolvers
│   │   └── schema.graphql        # GraphQL types, queries, subscriptions and mutations

```
