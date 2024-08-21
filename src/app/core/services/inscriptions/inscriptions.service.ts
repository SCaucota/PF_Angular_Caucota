import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { Inscription } from '../../../features/dashboard/inscriptions/models/inscription';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InscriptionsService {
  URL_BASE: string = "http://localhost:3000/inscriptions";

  constructor(private httpClient: HttpClient) {}

  getInscriptions(): Observable<Inscription[]> {
    return this.httpClient.get<Inscription[]>(`${this.URL_BASE}?_embed=course&_embed=student`);
  }

  getInscriptionById(id: string): Observable<Inscription> {
    return this.httpClient.get<Inscription>(`${this.URL_BASE}/${id}`)
  }

  addInscription(inscription: Inscription): Observable<Inscription> {
    return this.httpClient.post<Inscription>(this.URL_BASE, inscription)
  }

  deleteInscription(id: string): Observable<Inscription> {
    return this.httpClient.delete<Inscription>(`${this.URL_BASE}/${id}`)
  }

  editInscription(id: string, editingInscription: Inscription): Observable<any> {
    return this.httpClient.put<any>(`${this.URL_BASE}/${id}`, editingInscription)
  }

  cancelInscription(courseId: string, studentId: string): Observable<any> {
   return this.getInscriptions().pipe(
    switchMap(inscriptions => {
      const inscriptionCanceled = inscriptions.find(inscription => inscription.courseId === courseId && inscription.studentId === studentId);

      const idInscription = inscriptionCanceled?.id

      return this.httpClient.patch<any>(`${this.URL_BASE}/${idInscription}`, {status: false})
    })
   )
  }

}
