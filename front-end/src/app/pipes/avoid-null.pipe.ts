import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "avoidNull"
})
export class AvoidNullPipe implements PipeTransform {
  transform(value: any): any {
    console.log(value)
    if (value == "null null") {
      return "-";
    }else{
      return value
    }
  }
}
