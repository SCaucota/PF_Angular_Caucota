import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../users/models/user';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrl: './sidenavbar.component.scss'
})
export class SidenavbarComponent {
  
  @Output() toggleInicio = new EventEmitter<void>();

  authUser$: Observable<User | null>

  onToggleInicio(): void {
    this.toggleInicio.emit()
  }

  constructor(private authService: AuthService) {
    this.authUser$ = this.authService.authUser$;
  }

  logout(): void {
    this.authService.logout()
  }

}
