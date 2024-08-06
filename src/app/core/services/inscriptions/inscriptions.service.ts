import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Inscription } from '../../../features/dashboard/inscriptions/models/inscription';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InscriptionsService {
  private INSCRIPTIONS_DATABASE: Inscription[] = [
    {id: '1', studentId: '1', courseId: '1', date: new Date('2024-10-01'), status: true},
    {id: '2', studentId: '2', courseId: '2', date: new Date('2024-10-15'), status: true},
    {id: '3', studentId: '3', courseId: '3', date: new Date('2024-08-03'), status: false},
    {id: '4', studentId: '4', courseId: '4', date: new Date('2024-10-04'), status: true},
    {id: '5', studentId: '5', courseId: '5', date: new Date('2024-05-05'), status: false},
    {id: '6', studentId: '6', courseId: '6', date: new Date('2024-1-06'), status: true},
    {id: '7', studentId: '7', courseId: '7', date: new Date('2024-02-07'), status: true},
    {id: '8', studentId: '8', courseId: '8', date: new Date('2024-11-08'), status: true},
    {id: '9', studentId: '9', courseId: '9', date: new Date('2024-12-09'), status: true},
    {id: '10', studentId: '10', courseId: '10', date: new Date('2024-09-10'), status: false},
    {id: '11', studentId: '1', courseId: '2', date: new Date('2024-06-11'), status: true},
    {id: '12', studentId: '2', courseId: '3', date: new Date('2024-03-12'), status: false},
    {id: '13', studentId: '3', courseId: '4', date: new Date('2024-10-13'), status: true},
    {id: '14', studentId: '4', courseId: '5', date: new Date('2024-11-14'), status: true},
    {id: '15', studentId: '5', courseId: '6', date: new Date('2024-11-15'), status: true},
  ];

  constructor(private httpClient: HttpClient) {}

  getInscriptions(): Observable<Inscription[]> {
    /* return of([...this.INSCRIPTIONS_DATABASE]) */
    return this.httpClient.get<Inscription[]>("http://localhost:3000/inscriptions")
  }

  getInscriptionById(id: string) {
    /* return this.INSCRIPTIONS_DATABASE.find(inscription => inscription.id === id) */
    return this.httpClient.get<Inscription>("http://localhost:3000/inscriptions/" + id)
  }

  addInscription(inscription: Inscription) {
    const maxId = Math.max(...this.INSCRIPTIONS_DATABASE.map(a => +a.id));
    const newId = (maxId + 1).toString();

    this.INSCRIPTIONS_DATABASE.push({
      id: newId,
      studentId: inscription.studentId,
      courseId: inscription.courseId,
      date: new Date(inscription.date),
      status: inscription.status
    });
    return inscription
  }

  deleteInscription(id: string) {
    this.INSCRIPTIONS_DATABASE = this.INSCRIPTIONS_DATABASE.filter(inscription => inscription.id !== id)
  }

  editInscription(id: string, editingInscription: Inscription) {
    this.INSCRIPTIONS_DATABASE = this.INSCRIPTIONS_DATABASE.map((inscription) =>
      inscription.id === id ? {...editingInscription, id} : inscription
    )
    return editingInscription
  }

  cancelInscription(courseId: string, studentId: string) {
    /* this.INSCRIPTIONS_DATABASE = this.INSCRIPTIONS_DATABASE.map((inscription) =>
      (inscription.studentId === studentId && inscription.courseId === courseId) ? {...inscription, status: false} : inscription
    ) */
   return this.getInscriptions().pipe(
    switchMap(inscriptions => {
      const inscriptionCanceled = inscriptions.find(inscription => inscription.courseId === courseId && inscription.studentId === studentId);

      console.log(inscriptionCanceled)

      const idInscription = inscriptionCanceled?.id

      return this.httpClient.patch<void>(`http://localhost:3000/inscriptions/${idInscription}`, {status: false})
    })
   )
  }

}
