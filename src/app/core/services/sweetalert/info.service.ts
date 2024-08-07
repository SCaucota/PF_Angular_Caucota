import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  private info$ = new Subject<string>();

  constructor() {
    this.info$.subscribe({
      next: (txt) => {
        Swal.fire(txt, '', 'info')
      },
    })
  }

  sendInfo(txt: string) {
    this.info$.next(txt)
  }
}
