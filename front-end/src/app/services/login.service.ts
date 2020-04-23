import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  logIn(email: string, password: string) {
    return this.http.post(
      environment.API_PATH + "/login",
      {
        email: email,
        password: password
      },
      {
        withCredentials: true
      }
    );
  }

  logOut() {
    this.auth.currentUser = null;
    return this.http.get(environment.API_PATH + "/logout", {
      responseType: "text"
    });
  }
}
