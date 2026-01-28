export declare class CreateMonitorDto {
    name: string;
    url: string;
    interval?: number;
    timeout?: number;
    threshold?: number;
    regions?: string[];
    method?: string;
    expectedStatus?: number;
}
