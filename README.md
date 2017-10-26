# node-rest-api-starter
This node projectis a boilerplate rest API based on  express server, restify and and mongodb.

## Description
The project is a starter to create your rest api, you have just to add your resources:
We handle:
- Authentication by username/password and users management.
- Secure access to resource by access Token
- A base CRUD module that you can override as you want
- Connection to local or remote mongodb database

## Tools

- mongoose
- node
- express
- restify

## Installation

Clone the project to your local:

```bash
$ git clone git@github.com:marooking88/node-rest-api-starter.git
```

## Init
You can init your new resource files (controller,model adn routes) from a simple json file.
myjson.json to add 'book' resource:
```json
{
  "data": [
    {
      "autoCreate": true,
      "name": "book",
      "url": "/book",
      "methods": [
        "get",
        "post",
        "put",
        "delete"
      ],
      "access": "public",
      "fields": [
        {
          "title": "name",
          "type": "string",
          "required": true
        },
        {
          "title": "pages",
          "type": "number",
          "required": false
        },
        {
          "title": "author",
          "type": "string",
          "required": false
        }
      ]
    }
  ]
}

```
Parameters:
##### name: (string) 
the resource name.
##### url: (string) 
the resource URL
##### access: (string) 
if private , access by token to th resource.
##### autoCreate: (boolean) 
true when you want to add the resource.
##### fileds: (array)
Resource fields (database columns)[Object(title,type,required,unique)]  

### Create New Resource

to create the resource from myjson file you have  to run:
```bash
npm run create
```
## Demo

- install the node modules
```bash
npm install
```
- you can test the api by runnning the server on local:

```bash
npm start
```
or on debug mode using chrome debuger:
```bash
npm start-debug
```

- Go to http://localhost:8082/api

## Log

2 log files in log folder:
server:The server log messages.
api-create: Log when init new resource

## License

MIT © [Marouane ben guerfa](mailto:marwen.b.garfa@gmail.com)
