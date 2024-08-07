import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../users/models/user';
import { AuthService } from '../../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit{
  @Input() drawer!: MatDrawer

  currentRoute: string = '';
  students: string = '/dashboard/students'
  lessons: string = '/dashboard/lessons'
  inscriptions: string = '/dashboard/inscriptions'
  courses: string = '/dashboard/courses'
  users: string = '/dashboard/users'

  authUser$: Observable<User | null>

  constructor(private router: Router, private authService: AuthService) {
    this.authUser$ = this.authService.authUser$;
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url
    })
  }
}
