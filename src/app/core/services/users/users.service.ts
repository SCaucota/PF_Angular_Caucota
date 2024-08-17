import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../features/dashboard/users/models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  URL_BASE: string = "http://localhost:3000/users"

  constructor(private httpClient: HttpClient) { }

  generateToken(longitud: number): string {
    let token = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < longitud; i++) {
      const caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      token += caracterAleatorio;
    }
  
    return token;
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.URL_BASE);
  }

  getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.URL_BASE}/${id}`);
  }

  addUser(user: User): Observable<User> {

    const modifiedUser = {
      ...user,
      name: user.name.toUpperCase(),
      surname: user.surname.toUpperCase(),
      token: this.generateToken(20)
    }

    return this.httpClient.post<User>(this.URL_BASE, modifiedUser);
  }

  deleteUser(id: string): Observable<User> {
    return this.httpClient.delete<User>(`${this.URL_BASE}/${id}`);
  }

  editUser(id: string, editingUser: User): Observable<User> {
    const user = {
      ...editingUser,
      name: editingUser.name.toUpperCase(),
      surname: editingUser.surname.toUpperCase()
    }

    return this.httpClient.put<User>(`${this.URL_BASE}/${id}`, user);
  }
}
