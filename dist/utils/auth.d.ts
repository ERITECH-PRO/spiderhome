export interface User {
    id: number;
    username: string;
    role: 'admin' | 'editor';
}
export interface LoginAttempt {
    ip: string;
    username?: string;
    success: boolean;
    timestamp: Date;
}
export declare const logLoginAttempt: (attempt: LoginAttempt) => Promise<void>;
export declare const checkBruteForce: (ip: string, username?: string) => Promise<boolean>;
export declare const authenticateUser: (username: string, password: string, ip: string) => Promise<{
    success: boolean;
    user?: User;
    token?: string;
    message?: string;
}>;
export declare const verifyToken: (token: string) => {
    valid: boolean;
    user?: User;
    message?: string;
};
export declare const getClientIP: (req: any) => string;
//# sourceMappingURL=auth.d.ts.map