import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoursesService } from '../../../../../core/services/courses/courses.service';
import { StudentsService } from '../../../../../core/services/students/students.service';
import { CoursesDialogComponent } from '../courses-dialog/courses-dialog.component';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { Course } from '../../models/course';
import { DetailDialogComponent } from '../../../../../shared/components/detail-dialog/detail-dialog.component';
import { InscriptionsService } from '../../../../../core/services/inscriptions/inscriptions.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../users/models/user';

@Component({
  selector: 'app-crud-courses',
  templateUrl: './crud-courses.component.html',
  styleUrl: './crud-courses.component.scss'
})
export class CrudCoursesComponent implements OnInit{

  authUser$: Observable<User | null>

  constructor(
    private matDialog: MatDialog,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    private inscriptionService: InscriptionsService,
    private authService: AuthService
  ) {
    this.authUser$ = this.authService.authUser$;
   }

  displayedColumns: string[] = ['id', 'name', 'description', 'startDate', 'endDate', 'time', 'actions'];

  dataSource: Course[] = [];

  isAdmin: boolean = false;

  loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (coursesFormDb) => {
        this.dataSource = [...coursesFormDb]
      },
      error: (err) => console.log("Error al cargar los cursos: ", err)
    })
  }

  ngOnInit(): void {
    this.loadCourses();
    this.authService.authUser$.subscribe((user: User | null) => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(CoursesDialogComponent);

    dialogRef.componentInstance.onSubmitCourseEvent.subscribe((course: Course) => {
      this.onSubmitCourse(course)
    })
  }

  onSubmitCourse(course: Course): void {
    this.coursesService.addCourse(course);
    this.loadCourses();
  }

  deleteCourse(id: string): void {
    const course = this.coursesService.getCourseById(id);
  
    if (course?.students && course.students.length > 0) {
      course.students.forEach((studentId: string) => {
        this.coursesService.deleteStudentFromCourse(id, studentId);
        this.studentsService.unregisterStudent(id, studentId);
        this.inscriptionService.cancelInscription(studentId, id);
      });
    }

    const dialogRef = this.matDialog.open(DeleteDialogComponent, {
      data: {
        title: 'Eliminar Curso',
        entityName: 'el curso',
        item: course
      }
    });
  
    dialogRef.componentInstance.confirmDeleteEvent.subscribe(() => {
      this.coursesService.deleteCourse(id);
      this.loadCourses();
    });
  }
  

  editCourse(editingCourse: Course): void {
    this.matDialog.open(CoursesDialogComponent, {data: editingCourse}).afterClosed().subscribe({
      next: (value) => {
        if(!!value){
          this.coursesService.editCourse(editingCourse.id, value);
          this.loadCourses();
        }
      },
      error: (err) => console.log("Error al editar el curso: ", err)
    })
  }

  openDetail(id: string): void {
    const course = this.coursesService.getCourseById(id);
    let students: any[] = []
    if(course?.students && course?.students.length !== 0){
      students = course?.students.map((studentId: string) => {
        return this.studentsService.getStudentById(studentId) || null
      });
    }
    
    const dialogRef = this.matDialog.open(DetailDialogComponent, {
      data: {
        title: 'Detalles del curso',
        item: course,
        subitem: students
      }
    })

    dialogRef.componentInstance.confirmUnregistrationEvent.subscribe(({courseId, studentId}) => {
      this.coursesService.deleteStudentFromCourse(courseId, studentId);
      this.studentsService.unregisterStudent(courseId, studentId);
      this.inscriptionService.cancelInscription(courseId, studentId)
      this.loadCourses();
    })
  }
}
