import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth/auth.service';

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

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout()
  }

}
