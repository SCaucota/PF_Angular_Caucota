import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }
  
  login() {
    localStorage.setItem('token', 'asjdflkjsaeflkjsakfsefl');
    this.router.navigate(['dashboard', 'home']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['auth', 'login'])
  }
}
