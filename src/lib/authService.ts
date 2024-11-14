interface User {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol_id: number;
}

class AuthService {
    private static instance: AuthService;
    private user: User | null = null;
    private token: string | null = null;

    private constructor() {
        if (typeof window !== 'undefined') {
            this.loadSession();
        }
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private loadSession() {
        if (typeof window === 'undefined') return;

        const token = window.localStorage.getItem('authToken');
        const userData = window.localStorage.getItem('userData');
        
        if (token && userData) {
            try {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                if (tokenData.exp * 1000 > Date.now()) {
                    this.token = token;
                    this.user = JSON.parse(userData);
                } else {
                    this.clearSession();
                }
            } catch (error) {
                this.clearSession();
            }
        }
    }

    public isAuthenticated(): boolean {
        if (typeof window !== 'undefined') {
            this.loadSession();
        }
        return !!this.token;
    }

    public getUser(): User | null {
        return this.user;
    }

    public getToken(): string | null {
        return this.token;
    }

    public setSession(token: string, user: User) {
        this.token = token;
        this.user = user;
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('authToken', token);
            window.localStorage.setItem('userData', JSON.stringify(user));
        }
    }

    public clearSession() {
        this.token = null;
        this.user = null;
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('authToken');
            window.localStorage.removeItem('userData');
        }
    }
}

export const authService = AuthService.getInstance(); 