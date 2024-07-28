import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Time } from '../../../features/dashboard/courses/models/time';

@Injectable({
  providedIn: 'root'
})
export class TimesService {
  private TIMES_DATABASE: Time[] = [
    {viewValue: '08:00 - 10:00'},
    {viewValue: '08:30 - 10:30'},
    {viewValue: '09:00 - 11:00'},
    {viewValue: '09:30 - 11:30'},
    {viewValue: '10:00 - 12:00'},
    {viewValue: '10:30 - 12:30'},
    {viewValue: '11:00 - 13:00'},
    {viewValue: '16:00 - 18:00'},
    {viewValue: '16:30 - 18:30'},
    {viewValue: '17:00 - 19:00'},
    {viewValue: '17:30 - 19:30'},
    {viewValue: '18:00 - 20:00'},
    {viewValue: '18:30 - 20:30'},
    {viewValue: '19:00 - 21:00'},
    {viewValue: '19:30 - 21:30'},
    {viewValue: '20:00 - 22:00'},
    {viewValue: '20:30 - 22:30'},
    {viewValue: '21:00 - 23:00'},
    {viewValue: '21:30 - 23:30'},
    {viewValue: '22:00 - 00:00'},
    {viewValue: '22:30 - 00:30'}
  ];

  getTimes(): Observable<Time[]> {
    return of(this.TIMES_DATABASE);
  }
}
