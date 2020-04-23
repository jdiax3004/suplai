import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../../services/login.service";
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  constructor(private loginService: LoginService, private router: Router, public auth:AuthService) {}

  ngOnInit() {}

  cerrarSesion() {
    this.loginService.logOut().subscribe(data => {
      this.router.navigate(["/login"]);
      console.log(data);
    });
  }

}
