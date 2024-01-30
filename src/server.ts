//Expose the apifeeds over http(s).
import * as express from "express";

export default abstract class Server {
    public express: any = express;
    public router: any;
    public server: any;

    constructor(public port: number) {
        let server = this;
        server.router = server.express();
        server.routes = server.formatRoutes( server.routes() );
    }

    public routes: any = function() {
        let server = this;
        return {};
    }

    public formatRoutes( routes: any ): any {
        let self = this;
        let entries: any[] = self.entries( routes );
        let formattedRoutes: any[] = entries.reduce((allRoutes: any[], type: any ) => {
            let routeType: any = self.entries( type.value );
            let routes = routeType.reduce(( allPaths: any, path: any ) => {
                let route = {
                    path: path.key,
                    type: type.key,
                    handler: path.value
                };
                allPaths.push( route );
                return allPaths;
            }, []);
            allRoutes = allRoutes.concat( routes );
            return allRoutes;
        }, []);
        return formattedRoutes;
    }

    public setupRoutes() {
        let server = this;
        server.routes.forEach(( route: any ) => {
            server.router[route.type](route.path, route.handler.bind( server ));
        });
    }

    public entries( object: any ): { key: string, value: any }[] {
        let entries = Object.entries( object );
        let formatted: any = entries.reduce(( entries, property ) => {
            entries.push({
                key: property[0],
                value: property[1]
            });
            return entries;
        }, []);
        return formatted;
    }

    public async initialize(): Promise<void> {
        let server = this;
        return new Promise(function( resolve, reject ) {
            try {
                server.setupRoutes();
                server.server = server.router.listen(server.port, () => {
                    console.log(`Server listening on port ${server.port}`);
                    resolve();
                });
            } catch( error ) {
                reject( error );
            }
        });
    }

    public async close(): Promise<void> {
        let server = this;
        return new Promise(function( resolve, reject ) {
            try {
                server.server.close( () => {
                    console.log(`Server closed on port ${server.port}`);
                    resolve();
                });
            } catch( error ) {
                reject( error );
            }
        });
    }
}