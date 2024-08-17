import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../models/user';
import { UsersDialogComponent } from '../users-dialog/users-dialog.component';
import { filter, Observable, take} from 'rxjs';
import { DetailDialogComponent } from '../../../../../shared/components/detail-dialog/detail-dialog.component';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { Store } from '@ngrx/store';
import { selectIsLoadingUsers, selectSingleUser, selectUsers, selectUsersError, selectUserState } from '../../store/user.selectors';
import { UserActions } from '../../store/user.actions';
import { AlertsService } from '../../../../../core/services/sweetalert/alerts.service';

@Component({
  selector: 'app-crud-users',
  templateUrl: './crud-users.component.html',
  styleUrl: './crud-users.component.scss'
})
export class CrudUsersComponent implements OnInit{

  users$: Observable<User[]>;
  singleUser$: Observable<User>;
  isLoading$: Observable<boolean>;
  error$: Observable<unknown>

  constructor(
    private matDialog: MatDialog,
    private alertService: AlertsService,
    private store: Store
  ) {
    this.users$ = this.store.select(selectUsers);
    this.singleUser$ = this.store.select(selectSingleUser);
    this.isLoading$ = this.store.select(selectIsLoadingUsers);
    this.error$ = this.store.select(selectUsersError);
  }

  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'role', 'actions'];

  dataSource: User[] = [];

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUsers());
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(UsersDialogComponent);

    dialogRef.componentInstance.onSubmitUserEvent.subscribe({
      next: (user: User) => {
        this.onSubmitUser(user);
      },
      error: () => this.alertService.sendError('Error al abrir el form add de los usuarios')
    })
  }

  onSubmitUser(user: User): void {
    this.store.dispatch(UserActions.addUser({ data: user }));
  }

  deleteUser(id: string): void {
    this.store.dispatch(UserActions.userById({ id }));

    this.singleUser$.pipe(
      filter(user => !!user && user.id === id),
      take(1)
    ).subscribe({
      next: (user) => {
        const dialogRef = this.matDialog.open(DeleteDialogComponent, {
          data: {
            title: 'Eliminar Usuario',
            isEntityName: 'el usuario',
            item: user
          }
        })
  
        dialogRef.componentInstance.confirmDeleteEvent.subscribe(() => {
          this.store.dispatch(UserActions.deleteUser({ id }));
        })
      },
      error: () => this.alertService.sendError('Error al eliminar la clase')
    })
  }

  editUser(editingUser: User): void {
    this.matDialog.open(UsersDialogComponent, {data: editingUser}).afterClosed().subscribe({
      next: (value) => {
        if(!!value) {
          this.store.dispatch(UserActions.editUser({id: editingUser.id, editingUser: value}));
        }
      },
      error: () => this.alertService.sendError('Error al editar la clase')
    })
  }

  openDetail(id: string): void {
    this.store.dispatch(UserActions.userById({ id }));

    this.singleUser$.pipe(
      filter(user => !!user && user.id === id),
      take(1)
    ).subscribe({
      next: (user) => {
        this.matDialog.open(DetailDialogComponent, {
          data: {
            title: 'Detalles del Usuario',
            item: user,
            subitem: []
          }
        })
      },
      error: () => this.alertService.sendError('Se produjo un error al querer ver los detalles')
    })
  }
}
