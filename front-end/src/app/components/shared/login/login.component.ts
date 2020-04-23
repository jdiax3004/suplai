import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { LoginService } from "../../../services/login.service";
import { Router } from "@angular/router";
import { UsuarioModel } from "src/app/models/usuario.model";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.loginService.logIn(form.value.email, form.value.password).subscribe(
      (data: UsuarioModel) => {
        this.auth.currentUser = data;
        if(data.type == "admin"){
          this.router.navigate(["/home"]);
        }else{
          this.router.navigate(["/requisiciones"]);
        }
        
      },
      err => {
        console.log(err);
      }
    );
  }
}
