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

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.URL_BASE);
  }

  getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.URL_BASE}/${id}`);
  }

  addUser(user: User) {

    const modifiedUser = {
      ...user,
      firstName: user.firstName.toUpperCase(),
      lastName: user.lastName.toUpperCase(),
    }

    return this.httpClient.post(this.URL_BASE, modifiedUser);
  }
}
