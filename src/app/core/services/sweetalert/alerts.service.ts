import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private info$ = new Subject<string>();
  private error$ = new Subject<string>()

  constructor() {
    this.info$.subscribe({
      next: (txt) => {
        Swal.fire(txt, '', 'info')
      },
    })

    this.error$.subscribe({
      next: (txt) => {
        Swal.fire(txt, '', 'error')
      },
    })
  }

  sendInfo(txt: string) {
    this.info$.next(txt)
  }

  sendError(txt: string) {
    this.error$.next(txt)
  }
}
