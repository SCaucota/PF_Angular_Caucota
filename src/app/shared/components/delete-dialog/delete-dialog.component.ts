import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {
  @Output() confirmDeleteEvent = new EventEmitter<any>()

  constructor(
    private matDialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, entityName: string, item: any}
  ){ }

  get title(): string {
    return this.data.title
  }

  get entityName(): string {
    return this.data.entityName;
  }

  get item(): any {
    return this.data.item
  }

  hasFullName(item: any): boolean {
    return item.name && item.surname
  }

  confirmDelete(): void {
    this.matDialogRef.close();
    this.confirmDeleteEvent.emit(this.data.item)
  }
}
