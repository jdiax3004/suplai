import { Component, OnInit } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  totalRequisitions: Number;
  totalApprovedRequisitions: Number;
  totalDeniedRequisitions: Number;
  totalPendingRequisitions: Number;
  approvedBudget: Number;
  constructor(public usuariosService: UsuariosService) {}

  ngOnInit() {
    this.usuariosService.getStats().subscribe((response: any) => {
      console.log(response);
      this.approvedBudget = response.approvedBudget;
      this.totalRequisitions = response.totalRequisitions;
      this.totalApprovedRequisitions = response.totalApprovedRequisitions;
      this.totalDeniedRequisitions = response.totalDeniedRequisitions;
      this.totalPendingRequisitions = response.totalPendingRequisitions;
    });
  }
}
