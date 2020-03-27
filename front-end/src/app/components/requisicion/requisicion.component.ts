import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReqisicionesService } from "../../services/reqisiciones.service";
import { RequisicionModel } from "../../models/requesicion.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-requisicion",
  templateUrl: "./requisicion.component.html",
  styleUrls: ["./requisicion.component.css"]
})
export class RequisicionComponent implements OnInit {
  requisicion: RequisicionModel;

  constructor(
    private router: ActivatedRoute,
    private requisicionesService: ReqisicionesService,
    private toastr: ToastrService,
    private routernav: Router
  ) {
    this.router.params.subscribe(params => {
      this.obtenerRequisicionPorID(params["id"]);
    });
  }

  ngOnInit() {}

  obtenerRequisicionPorID(id: string) {
    this.requisicionesService
      .obtenerRequisicionPorID(id)
      .subscribe((data: RequisicionModel) => {
        this.requisicion = data;
      });
  }

  aprobar() {
    console.log("Testing");
    this.requisicionesService
      .aprobarRequisicionJefeAprobador(this.requisicion)
      .subscribe(data => {
        console.log(data);
        this.toastr.success("¡Requisicion aprobada exitosamente!", "¡Exito!");
        this.routernav.navigate(["/requisiciones"]);
      });
  }
}
