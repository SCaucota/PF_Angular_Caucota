import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTitle]'
})
export class TitleDirective {

  @Input()
  size = '20px'

  constructor(public elementRef: ElementRef) { 
    this.elementRef.nativeElement.style.fontSize = this.size
  }

}
