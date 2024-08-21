import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Time } from '../../../features/dashboard/courses/models/time';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimesService {
  URL_BASE: string = "http://localhost:3000/times";

  constructor(private httpCLient: HttpClient) {}

  getTimes(): Observable<Time[]> {
    return this.httpCLient.get<Time[]>(this.URL_BASE)
  }
}
