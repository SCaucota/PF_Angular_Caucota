import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullname'
})
export class FullnamePipe implements PipeTransform {

  transform(value: {name: string, surname: string}): string {
    if(!value) {
      return '';
    }
    return `${value.name} ${value.surname}`;
  }
}
