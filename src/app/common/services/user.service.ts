import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$ = new BehaviorSubject(null);

  isAuthenticated(): boolean {
    if (this.user$.value) return true;
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      this.user$.next(JSON.parse(stored));
      return true;
    }
    return false;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.user$.next(null);
  }
}