import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterIcons'
})
export class FilterIconsPipe implements PipeTransform {

  transform(value: string): any {
    if (value) {
      let startIndex = value.indexOf('"');
      let endIndex = value.lastIndexOf('"');
      return value.substr(startIndex + 1, endIndex - startIndex - 1)
    }
    return '';
  }

}
