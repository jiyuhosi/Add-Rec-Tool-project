const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

const FIXED_USERNAME = 'testuser01';
const FIXED_PASSWORD = 'test1234';

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    refreshExpiresIn: number;
}

class AuthService {
    private baseUrl = import.meta.env.VITE_API_URL;
    private refreshTimer: number | null = null;
    private isInitialized = false;

    private saveTokens(tokenData: TokenResponse): void {
        localStorage.setItem(TOKEN_KEY, tokenData.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refreshToken);

        const expiryTime = Date.now() + tokenData.expiresIn * 1000;
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

        this.scheduleTokenRefresh(tokenData.expiresIn);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    private getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    private clearTokens(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);

        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    private async autoLogin(): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/auth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: FIXED_USERNAME,
                    password: FIXED_PASSWORD,
                }),
            });

            if (!response.ok) {
                throw new Error('Auto login failed');
            }

            const tokenData: TokenResponse = await response.json();
            this.saveTokens(tokenData);
            console.log('Auto login successful');
        } catch (error) {
            console.error('Auto login failed:', error);
            throw error;
        }
    }

    private async refreshAccessToken(): Promise<void> {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            console.log('No refresh token, performing auto login');
            await this.autoLogin();
            return;
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/api/v1/auth/refresh`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken: refreshToken }),
                }
            );

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const tokenData: TokenResponse = await response.json();
            this.saveTokens(tokenData);
            console.log('Token refreshed successfully');
        } catch (error) {
            console.error(
                'Token refresh failed, performing auto login:',
                error
            );
            this.clearTokens();
            await this.autoLogin();
        }
    }

    private scheduleTokenRefresh(expiresIn: number): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }

        const refreshTime = Math.max((expiresIn - 30) * 1000, 0);

        this.refreshTimer = window.setTimeout(async () => {
            await this.refreshAccessToken();
        }, refreshTime);
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        const token = this.getAccessToken();
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

        if (!token || !expiry) {
            await this.autoLogin();
        } else {
            const expiresIn = (parseInt(expiry) - Date.now()) / 1000;

            if (expiresIn > 0) {
                this.scheduleTokenRefresh(expiresIn);
            } else {
                await this.refreshAccessToken();
            }
        }

        this.isInitialized = true;
    }

    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

        if (!token || !expiry) {
            return false;
        }

        return Date.now() < parseInt(expiry);
    }
}

export const authService = new AuthService();
