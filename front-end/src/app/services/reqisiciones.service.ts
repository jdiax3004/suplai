import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { RequisicionModel } from "../models/requesicion.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class ReqisicionesService {
  constructor(private http: HttpClient) {}

  obtenerRequisiones() {
    return this.http.get(environment.API_PATH + "/requisitions", {
      withCredentials: true
    });
  }

  obtenerRequisicionPorID(id: string) {
    return this.http.get(environment.API_PATH + "/requisitions/" + id, {
      withCredentials: true
    });
  }

  crearRequisicion(requisicion: any) {
    var numBudget = +requisicion.budget;
    return this.http.post(
      environment.API_PATH + "/requisition",
      {
        title: requisicion.title,
        description: requisicion.description,
        budget: numBudget
      },
      {
        withCredentials: true,
        headers: new HttpHeaders().append("Content-Type", "application/json")
      }
    );
  }

  aprobarRequisicion(requisicion: any, type: string) {
    let statusValue = type === "BOSS" ? 1 : 2;
    return this.http.put(
      environment.API_PATH + "/requisition/" + requisicion._id,
      {
        status: statusValue
      },
      {
        withCredentials: true,
        headers: new HttpHeaders().append("Content-Type", "application/json")
      }
    );
  }

  rechazarRequisicion(requisicion: any) {
    return this.http.put(
      environment.API_PATH + "/requisition/" + requisicion._id,
      {
        status: 3
      },
      {
        withCredentials: true,
        headers: new HttpHeaders().append("Content-Type", "application/json")
      }
    );
  }
}
