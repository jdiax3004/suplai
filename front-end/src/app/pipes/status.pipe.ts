import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "status"
})
export class StatusPipe implements PipeTransform {
  transform(value: any): any {
    switch (value) {
      case 0:
        return "Pendiente";
        break;
      case 1:
        return "Aceptado Jefe";
        break;
      case 2:
        return "Aceptado Financiero";
        break;
      case 3:
        return "Rechazado";
        break;
    }
  }
}
