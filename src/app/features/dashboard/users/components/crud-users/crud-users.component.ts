import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../../../../core/services/users/users.service';
import { User } from '../../models/user';
import { UsersDialogComponent } from '../users-dialog/users-dialog.component';
import { tap } from 'rxjs';
import { DetailDialogComponent } from '../../../../../shared/components/detail-dialog/detail-dialog.component';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-crud-users',
  templateUrl: './crud-users.component.html',
  styleUrl: './crud-users.component.scss'
})
export class CrudUsersComponent {
  constructor(
    private matDialog: MatDialog,
    private usersService: UsersService
  ) {}

  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'role', 'actions'];

  dataSource: User[] = [];

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (usersFormDb) => {
        this.dataSource = [...usersFormDb]
      },
      error: (err) => console.log("Error al cargar los usuarios: ", err)
    })
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(UsersDialogComponent);

    dialogRef.componentInstance.onSubmitUserEvent.subscribe((user => {
      this.onSubmitUser(user);
    }))
  }

  onSubmitUser(user: User): void {
    this.usersService.addUser(user).pipe(
      tap(() => this.loadUsers())
    ).subscribe()
  }

  deleteUser(id: string): void {
    this.usersService.getUserById(id).subscribe(user => {
      const dialogRef = this.matDialog.open(DeleteDialogComponent, {
        data: {
          title: 'Eliminar Usuario',
          isEntityName: 'el usuario',
          item: user
        }
      })

      dialogRef.componentInstance.confirmDeleteEvent.subscribe(() => {
        this.usersService.deleteUser(id).pipe(
          tap(() => this.loadUsers())
        ).subscribe()
      })
    })
  }

  editUser(editingUser: User): void {
    this.matDialog.open(UsersDialogComponent, {data: editingUser}).afterClosed().subscribe({
      next: (value) => {
        if(!!value) {
          this.usersService.editUser(editingUser.id, value).pipe(
            tap(() => this.loadUsers())
          ).subscribe()
        }
      },
      error: (err) => console.log("Error al editar el usuario: ", err)
    })
  }

  openDetail(id: string): void {
    this.usersService.getUserById(id).subscribe(user => {
      this.matDialog.open(DetailDialogComponent, {
        data: {
          title: 'Detalles del Usuario',
          item: user,
          subitem: []
        }
      })
    })
  }
}
