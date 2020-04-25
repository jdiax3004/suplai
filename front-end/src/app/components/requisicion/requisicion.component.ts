import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReqisicionesService } from "../../services/reqisiciones.service";
import { RequisicionModel } from "../../models/requesicion.model";
import { ToastrService } from "ngx-toastr";
import { UsuarioModel } from "../../models/usuario.model";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-requisicion",
  templateUrl: "./requisicion.component.html",
  styleUrls: ["./requisicion.component.css"]
})
export class RequisicionComponent implements OnInit {
  requisicion: RequisicionModel;
  usuario: UsuarioModel;

  constructor(
    private router: ActivatedRoute,
    private requisicionesService: ReqisicionesService,
    private toastr: ToastrService,
    private routernav: Router,
    public authService: AuthService
  ) {
    this.router.params.subscribe(params => {
      this.obtenerRequisicionPorID(params["id"]);
    });
  }

  ngOnInit() {

  }

  obtenerRequisicionPorID(id: string) {
    this.requisicionesService
      .obtenerRequisicionPorID(id)
      .subscribe((data: RequisicionModel) => {
        this.requisicion = data;
      });
  }

  aprobar() {
    let type = this.authService.currentUser.type;
    this.requisicionesService
      .aprobarRequisicion(this.requisicion, type)
      .subscribe(data => {
        console.log(data);
        this.toastr.success("¡Requisicion aprobada exitosamente!", "¡Exito!");
        this.routernav.navigate(["/requisiciones"]);
      });
  }
  rechazar() {
    this.requisicionesService
      .rechazarRequisicion(this.requisicion)
      .subscribe(data => {
        this.toastr.success("¡Requisicion Rechazada Exitosamente!", "¡Exito!");
        this.routernav.navigate(["/requisiciones"]);
      });
  }
}
