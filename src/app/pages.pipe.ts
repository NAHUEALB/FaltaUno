import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pages'
})
export class PagesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
