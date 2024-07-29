import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InscriptionsService } from '../../../../../../core/services/inscriptions/inscriptions.service';
import { Inscription } from '../../../models/inscription';
import { DeleteDialogComponent } from '../../../../../../shared/components/delete-dialog/delete-dialog.component';
import { InscriptionsDialogComponent } from '../../inscriptions-dialog/inscriptions-dialog/inscriptions-dialog.component';
import { DetailDialogComponent } from '../../../../../../shared/components/detail-dialog/detail-dialog.component';
import { StudentsService } from '../../../../../../core/services/students/students.service';
import { CoursesService } from '../../../../../../core/services/courses/courses.service';

@Component({
  selector: 'app-crud-inscriptions',
  templateUrl: './crud-inscriptions.component.html',
  styleUrl: './crud-inscriptions.component.scss'
})
export class CrudInscriptionsComponent {
  constructor(
    private matDialog: MatDialog,
    private inscriptionsService: InscriptionsService,
    private studentsService: StudentsService,
    private coursesService: CoursesService
  ) { }

  displayedColumns: string[] = ['id', 'studentId', 'courseId', 'date', 'status', 'actions', 'detail'];

  dataSource: Inscription[] = [];

  loadInscription() {
    this.inscriptionsService.getInscriptions().subscribe({
      next: (inscriptionFormDb) => {
        this.dataSource = [...inscriptionFormDb]
      }
    })
  }

  ngOnInit(): void {
    this.loadInscription();
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(InscriptionsDialogComponent);

    dialogRef.componentInstance.onSubmitInscriptionEvent.subscribe((inscription: Inscription) => {
      this.onSubmitInscription(inscription);
    })
  }

  onSubmitInscription(inscription: Inscription): void {
    const newInscription = this.inscriptionsService.addInscription(inscription);
    this.coursesService.addStudentToCourse(newInscription.studentId, newInscription.courseId)
    this.studentsService.addCourseToStudent(newInscription.courseId, newInscription.studentId)
    this.loadInscription();
  }

  deleteInscription(id: string): void {
    const inscription = this.inscriptionsService.getInscriptionById(id)
    const dialogRef = this.matDialog.open(DeleteDialogComponent, {
      data: {
        title:'Eliminar Inscripción',
        entityName: 'la inscripción',
        item: inscription
      }
    })

    dialogRef.componentInstance.confirmDeleteEvent.subscribe((inscription: Inscription) => {
      this.inscriptionsService.deleteInscription(id);
      this.coursesService.deleteStudentFromCourse(inscription.studentId);
      this.studentsService.unregisterStudent(inscription.courseId)
      this.loadInscription()
    })
  }

  editInscription(editingInscription: Inscription): void {
    const originalInscription = { ...editingInscription };

    this.matDialog.open(InscriptionsDialogComponent, {data: editingInscription}).afterClosed().subscribe({
      next: (updatedInscription) => {
        if (updatedInscription) {
          this.inscriptionsService.editInscription(editingInscription.id, updatedInscription);

          if (originalInscription.studentId !== updatedInscription.studentId) {
            console.log(originalInscription.courseId)
            this.coursesService.deleteStudentFromCourse(originalInscription.studentId);
            this.studentsService.unregisterStudent(originalInscription.courseId);

            this.coursesService.addStudentToCourse(updatedInscription.studentId, updatedInscription.courseId);
            this.studentsService.addCourseToStudent(updatedInscription.courseId, updatedInscription.studentId);
          } else if (originalInscription.courseId !== updatedInscription.courseId) {
            this.coursesService.deleteStudentFromCourse(originalInscription.studentId);
            this.studentsService.unregisterStudent(originalInscription.courseId);

            this.coursesService.addStudentToCourse(updatedInscription.studentId, updatedInscription.courseId);
            this.studentsService.addCourseToStudent(updatedInscription.courseId, updatedInscription.studentId);
          }

          this.loadInscription();
        }
      }
    });
  }

  openDetail(id: string): void {
    const inscription = this.inscriptionsService.getInscriptionById(id);
    const studentid = inscription?.studentId
    const student = studentid ? this.studentsService.getStudentById(studentid) : null
    const courseid = inscription?.courseId;
    const course = courseid ? this.coursesService.getCourseById(courseid) : null
    const subdata = {student: student, course: course}
    this.matDialog.open(DetailDialogComponent, {
      data: {
        title: 'Detalles de la inscripción',
        item: inscription,
        subitem: subdata
      }
    })
  }
}
