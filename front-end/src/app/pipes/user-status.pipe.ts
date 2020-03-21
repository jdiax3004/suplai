import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userStatus'
})
export class UserStatusPipe implements PipeTransform {

  transform(value: any): any {
    switch (value) {
      case true:
        return "Activo";
        break;
      case false:
        return "Inactivo";
        break;
    }
  }

}
