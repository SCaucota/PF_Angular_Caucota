import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-unregister-dialog',
  templateUrl: './unregister-dialog.component.html',
  styleUrl: './unregister-dialog.component.scss'
})
export class UnregisterDialogComponent {
  @Output() confirmUnregistrationEvent = new EventEmitter

  constructor(
    private matDialogRef: MatDialogRef<UnregisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {entityName: string, item: any}
  ){ }

  get entityName(): string {
    return this.data.entityName;
  }

  get item(): any {
    return this.data.item;
  }

  confirmUnregistration():void{
    this.confirmUnregistrationEvent.emit()
    this.matDialogRef.close(true)
  }
}
