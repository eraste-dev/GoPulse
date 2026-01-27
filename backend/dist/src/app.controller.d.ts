import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: string;
            api: string;
        };
        version: string;
    }>;
}
