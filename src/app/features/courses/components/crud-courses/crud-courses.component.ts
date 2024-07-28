import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoursesService } from '../../../../core/services/courses/courses.service';
import { CoursesDialogComponent } from '../courses-dialog/courses-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Course } from '../../models/course';

@Component({
  selector: 'app-crud-courses',
  templateUrl: './crud-courses.component.html',
  styleUrl: './crud-courses.component.scss'
})
export class CrudCoursesComponent implements OnInit{

  constructor(private matDialog: MatDialog, private coursesService: CoursesService) { }

  displayedColumns: string[] = ['id', 'name', 'description', 'startDate', 'endDate', 'time', 'actions'];

  dataSource: Course[] = [];

  loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (coursesFormDb) => {
        this.dataSource = [...coursesFormDb]
      }
    })
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(CoursesDialogComponent);

    dialogRef.componentInstance.onSubmitCourseEvent.subscribe((course: Course) => {
      this.onSubmitCourse(course);
    })
  }

  onSubmitCourse(course: Course): void {
    const curso = this.coursesService.addCourse(course);
    console.log(curso)
    this.loadCourses();
  }

  deleteCourse(id: string): void {
    const course = this.coursesService.getCourseById(id)
    const dialogRef = this.matDialog.open(DeleteDialogComponent, {data: course})

    dialogRef.componentInstance.deleteCourseEvent.subscribe((course: Course) => {
      this.coursesService.deleteCourse(id);
      this.loadCourses()
    })
  }

  editCourse(editingCourse: Course): void {
    this.matDialog.open(CoursesDialogComponent, {data: editingCourse}).afterClosed().subscribe({
      next: (value) => {
        if(!!value){
          this.coursesService.editCourse(editingCourse.id, value);
          this.loadCourses();
        }
      }
    })
  }
}
