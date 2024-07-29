import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InscriptionsService } from '../../../../../../core/services/inscriptions/inscriptions.service';
import { Inscription } from '../../../models/inscription';
import { DeleteDialogComponent } from '../../../../../../shared/components/delete-dialog/delete-dialog/delete-dialog.component';
import { InscriptionsDialogComponent } from '../../inscriptions-dialog/inscriptions-dialog/inscriptions-dialog.component';

@Component({
  selector: 'app-crud-inscriptions',
  templateUrl: './crud-inscriptions.component.html',
  styleUrl: './crud-inscriptions.component.scss'
})
export class CrudInscriptionsComponent {
  constructor(private matDialog: MatDialog, private inscriptionsService: InscriptionsService) { }

  displayedColumns: string[] = ['id', 'studentId', 'courseId', 'date', 'status', 'actions'];

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
    this.inscriptionsService.addInscription(inscription);
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
      this.loadInscription()
    })
  }

  editInscription(editingInscription: Inscription): void {
    this.matDialog.open(InscriptionsDialogComponent, {data: editingInscription}).afterClosed().subscribe({
      next: (value) => {
        if(!!value){
          this.inscriptionsService.editInscription(editingInscription.id, value);
          this.loadInscription();
        }
      }
    })
  }
}
