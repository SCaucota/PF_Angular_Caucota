import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LessonsService } from '../../../../../core/services/lessons/lessons.service';
import { Lesson } from '../../models/lesson';
import { LessonsDialogComponent } from '../lessons-dialog/lessons-dialog.component';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { DetailDialogComponent } from '../../../../../shared/components/detail-dialog/detail-dialog.component';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../users/models/user';

@Component({
  selector: 'app-crud-lessons',
  templateUrl: './crud-lessons.component.html',
  styleUrl: './crud-lessons.component.scss'
})
export class CrudLessonsComponent implements OnInit{

  authUser$: Observable<User | null>

  constructor(
    private matDialog: MatDialog,
    private lessonsService: LessonsService,
    private authService: AuthService
  ) {
    this.authUser$ = this.authService.authUser$;
   }

  displayedColumns: string[] = ['id', 'name', 'date', 'courseTitle', 'status', 'actions'];

  dataSource: Lesson[] = [];

  isAdmin: boolean = false;

  loadLessons() {
    this.lessonsService.getLessons().subscribe({
      next: (lessonsFormDb) => {
        this.dataSource = [...lessonsFormDb]
      },
      error: (err) => console.log("Error al cargar las clases: ", err)
    })
  }

  ngOnInit(): void {
    this.loadLessons();
    this.authService.authUser$.subscribe((user: User | null) => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(LessonsDialogComponent);

    dialogRef.componentInstance.onSubmitLessonEvent.subscribe((lesson: Lesson) => {
      this.onSubmitLesson(lesson);
    })
  }

  onSubmitLesson(lesson: Lesson): void {
    this.lessonsService.addLesson(lesson);
    this.loadLessons();
  }

  deleteLesson(id: string): void {
    const lesson = this.lessonsService.getLessonById(id)
    const dialogRef = this.matDialog.open(DeleteDialogComponent, {
      data: {
        title:'Eliminar Clase',
        entityName: 'la clase',
        item: lesson
      }
    })

    dialogRef.componentInstance.confirmDeleteEvent.subscribe((lesson: Lesson) => {
      this.lessonsService.deleteLesson(id);
      this.loadLessons()
    })
  }

  editLesson(editingLesson: Lesson): void {
    this.matDialog.open(LessonsDialogComponent, {data: editingLesson}).afterClosed().subscribe({
      next: (value) => {
        if(!!value){
          this.lessonsService.editLesson(editingLesson.id, value);
          this.loadLessons();
        }
      },
      error: (err) => console.log("Error al editar la clase: ", err)
    })
  }

  openDetail(id: string): void {
    const lesson = this.lessonsService.getLessonById(id)
    this.matDialog.open(DetailDialogComponent, {
      data: {
        title: 'Detalles de la Clase',
        item: lesson,
        subitem: []
      }
    })
  }
}
