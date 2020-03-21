import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "userRole"
})
export class UserRolePipe implements PipeTransform {
  transform(value: any): any {
    
    switch (value) {
      case "1":
        return "Administrador";
        break;
      case "admin":
        return "Administrador";
        break;
      case "ADMIN":
        return "Administrador";
        break;
      case "BUYER":
        return "Comprador";
        break;
      case "BOSS":
        return "Jefe Aprobador";
        break;
      case "FINANCER":
        return "Jefe Financiero";
        break;
    }
  }
}
