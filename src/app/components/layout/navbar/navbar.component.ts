import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { AbmAlumnosComponent } from '../../abm-alumnos/abm-alumnos.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @ViewChild('drawer') drawer!: MatSidenav;

  onMenuToggle() {
    this.drawer.toggle();
  }

  constructor(private matDialog: MatDialog) {}

  openDialog(): void {
    this.matDialog.open(AbmAlumnosComponent).afterClosed().subscribe({
      next: (value) => {
        
      }
    })
  }
}
