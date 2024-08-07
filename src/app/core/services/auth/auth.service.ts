import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { User } from '../../../features/dashboard/users/models/user';
import { HttpClient } from '@angular/common/http';
import { InfoService } from '../sweetalert/info.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authUser$ = new BehaviorSubject<User | null>(null);

  authUser$ = this._authUser$.asObservable();

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private info: InfoService
  ) { }
  
  login(data: {email: string, password: string}) {
    this.httpClient.get<User[]>(`http://localhost:3000/users`, {
      params: {
        email: data.email,
        password: data.password
      }
    }).subscribe({
      next: (response) => {
        if(!response.length) {
          alert('Usuario o password invalido')
        }else {
          const authUser = response[0];
          localStorage.setItem('token', authUser.token)
          this._authUser$.next(authUser);
          this.router.navigate(['dashboard', 'home'])
        }
      },
      error: (err) => {
        this.info.sendInfo('Lo sentimos, se produjo un error en nuestros servidores')
      }
    })
  }

  logout() {
    localStorage.removeItem('token');
    this._authUser$.next(null);
    this.router.navigate(['auth', 'login']);
  }

  verifyToken(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if(!token) {
      return of(false)
    }
    
    return this.httpClient.get<User[]>(`http://localhost:3000/users`, {
      params: {
        token
      }
    }).pipe(
      map((response) => {
        if(!response.length) {
          return false;
        }else {
          const authUser = response[0];
          localStorage.setItem('token', authUser.token)
          this._authUser$.next(authUser);
          return true
        }
      })
    )
  }
}