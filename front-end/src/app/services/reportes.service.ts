import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http: HttpClient) {}

  obtenerReportes(params?: any) {
    console.log(params)
    return this.http.get(environment.API_PATH + "/requisitions/stats", {
      params,
      withCredentials: true
    });
  }


  obtenerCounter(params?: any) {
    console.log(params)
    return this.http.get(environment.API_PATH + "/requisitions/counter", {
      params,
      withCredentials: true
    });
  }
}
