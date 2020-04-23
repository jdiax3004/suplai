import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UsuarioModel } from "../models/usuario.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsuariosService {
  constructor(private http: HttpClient) {}

  obtenerUsuarios() {
    return this.http.get(environment.API_PATH + "/users", {
      withCredentials: true,
    });
  }

  obtenerUsuarioPorID(id: string) {
    return this.http.get(environment.API_PATH + "/users/" + id);
  }

  crearUsuario(usuario: any) {
    return this.http.post(environment.API_PATH + "/register", {
      name: usuario.nombre,
      last_name: usuario.apellidos,
      email: usuario.correo,
      password: usuario.contrasena,
      type: usuario.tipoUsuario,
      boss: usuario.jefeUsuario,
    });
  }

  editarUsuario(usuario: any, id) {
    console.log(usuario.name);
    return this.http.put(environment.API_PATH + "/user/" + id, {
      name: usuario.nombre,
      last_name: usuario.apellidos,
      email: usuario.correo,
      password: usuario.contrasena,
      type: usuario.tipoUsuario,
      boss: usuario.jefeUsuario,
    });
  }

  eliminarUsuario(id: string) {
    return this.http.put(environment.API_PATH + "/user/" + id, {
      status: false,
    });
  }

  obtenerDatosComboBox(tipoUsuario: string) {
    return this.http.get(
      environment.API_PATH + "/userFilter?type=" + tipoUsuario
    );
  }

  getCurrent() {
    return this.http.get(environment.API_PATH + "/current", {
      withCredentials: true,
    });
  }
}
