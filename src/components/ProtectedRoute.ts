import { authService } from '../lib/authService';

export function protectRoute() {
    if (!authService.isAuthenticated()) {
        window.location.href = '/login';
        return false;
    }
    return true;
} 