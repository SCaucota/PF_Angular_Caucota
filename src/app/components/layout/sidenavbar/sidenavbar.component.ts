import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrl: './sidenavbar.component.scss'
})
export class SidenavbarComponent {
  /* showAlumnos = false; */

  @Output() toggleAlumnos = new EventEmitter<void>();

  onToggleAlumnos(): void {
    this.toggleAlumnos.emit()
  }

}
