import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserRole } from '../../../features/dashboard/users/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private VALID_TOKEN = 'adsklfjlsejcñkdkfknññfss';
  private FAKE_USER = {
    id: '1', 
    firstName: 'Sofia',
    lastName: 'Caucota',
    email: 'Sj6gA@example.com',
    password: '123456',
    role: 'ADMIN' as UserRole,
    token: 'asfejoaeiskjfesl'
  };

  private _authUser$ = new BehaviorSubject<User | null>(null);

  authUser$ = this._authUser$.asObservable();

  constructor(private router: Router) { }
  
  login() {
    this._authUser$.next(this.FAKE_USER);
    localStorage.setItem('token', this.VALID_TOKEN);
    this.router.navigate(['dashboard', 'home']);
  }

  logout() {
    localStorage.removeItem('token');
    this._authUser$.next(null);
    this.router.navigate(['auth', 'login']);
  }

  verifyToken(): Observable<boolean> {
    const token = localStorage.getItem('token');
    const isValid =  this.VALID_TOKEN === token;

    if(isValid) {
      this._authUser$.next(this.FAKE_USER);
    }

    return of(isValid)
  }
}
