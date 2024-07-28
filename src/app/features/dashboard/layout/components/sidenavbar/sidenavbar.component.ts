import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrl: './sidenavbar.component.scss'
})
export class SidenavbarComponent {
  
  @Output() toggleInicio = new EventEmitter<void>();

  onToggleInicio(): void {
    this.toggleInicio.emit()
  }

}
