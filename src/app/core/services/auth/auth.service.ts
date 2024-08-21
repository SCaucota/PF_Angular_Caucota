import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { User } from '../../../features/dashboard/users/models/user';
import { HttpClient } from '@angular/common/http';
import { AlertsService } from '../sweetalert/alerts.service';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../store/auth/auth.actions';
import { LessonActions } from '../../../features/dashboard/lessons/store/lesson.actions';
import { UserActions } from '../../../features/dashboard/users/store/user.actions';
import { CourseActions } from '../../../features/dashboard/courses/store/course.actions';
import { StudentActions } from '../../../features/dashboard/students/store/student.actions';
import { InscriptionActions } from '../../../features/dashboard/inscriptions/store/inscription.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authUser$ = new BehaviorSubject<User | null>(null);

  authUser$ = this._authUser$.asObservable();

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private alertsService: AlertsService,
    private store: Store
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
          this.alertsService.sendError('Formulario Inválido')
        }else {
          const authUser = response[0];
          localStorage.setItem('token', authUser.token)
          this._authUser$.next(authUser);
          this.store.dispatch(AuthActions.setAuthsUserSuccess({ data: authUser }))
          this.router.navigate(['dashboard', 'home'])
        }
      },
      error: (err) => {
        this.alertsService.sendInfo('Lo sentimos, se produjo un error en nuestros servidores');
        this.store.dispatch(AuthActions.setAuthsUserFailure({error: err}))
      }
    })
  }

  logout() {
    localStorage.removeItem('token');
    this._authUser$.next(null);
    this.store.dispatch(AuthActions.unsetAuthsUser());
    this.store.dispatch(LessonActions.resetLessonsState());
    this.store.dispatch(UserActions.resetUserState());
    this.store.dispatch(CourseActions.resetCourseState());
    this.store.dispatch(InscriptionActions.resetInscriptionState());
    this.store.dispatch(StudentActions.resetStudentState());
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
          this.store.dispatch(AuthActions.setAuthsUserSuccess({ data: authUser }))
          return true
        }
      })
    )
  }
}
