# Server

1. Create a route member that has type any and is assigned to a function that returns an object that contains the routes and their corresponding methods.

```typescript
class myServer extends Server {
  public state: any = function() {
    return {
      "get": {
        "/": function( request: any, response: any ) {
          response.send("Hello World!");
        }
      }
    };
  }
}
```
2. Instantiate the server with the port you want it to listen on.
```typescript
let server = new myServer(8000);
```

3. Call the asynchronous initialize method to setup the server after instantiating it.
```typescript
await server.initialize();
```