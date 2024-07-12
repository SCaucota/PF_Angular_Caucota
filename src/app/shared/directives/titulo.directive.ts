import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appTitulo]'
})
export class TituloDirective {

  @Input()
  size = '20px'

  constructor(public elementRef: ElementRef) { 
    this.elementRef.nativeElement.style.fontSize = this.size
  }

}
