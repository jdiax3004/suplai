import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UsuariosService } from "../../services/usuarios.service";
import { UsuarioModel } from "../../models/usuario.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
//ToastrService
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrls: ["./usuario.component.css"]
})
export class UsuarioComponent implements OnInit {
  usuario: UsuarioModel;
  editar: boolean = false;
  forma: FormGroup;
  selectInfo: any[] = [];
  selectUsuario: string;
  id: string;

  constructor(
    private router: ActivatedRoute,
    private usuariosService: UsuariosService,
    private navRouter: Router,
    private toastr: ToastrService
  ) {
    this.router.params.subscribe(params => {
      this.id = params["id"];
      this.obtenerUsuarioPorID(this.id);
    });
    this.forma = new FormGroup({
      nombre: new FormControl("", Validators.required),
      apellidos: new FormControl("", Validators.required),
      correo: new FormControl("", [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
      ]),
      contrasena: new FormControl("", Validators.required),
      tipoEstado: new FormControl({})
    });
  }

  ngOnInit() {}

  obtenerUsuarioPorID(id: string) {
    this.usuariosService
      .obtenerUsuarioPorID(id)
      .subscribe((data: UsuarioModel) => {
        this.usuario = data;
        console.log(this.usuario);
      });
  }

  editarUsuario() {
    this.editar = !this.editar;
  }

  guardarCambios() {
    console.log(this.forma.value);
    console.log(this.forma);
    this.usuariosService.editarUsuario(this.forma.value, this.id).subscribe(
      data => {
        console.log(data);

        this.toastr.success("¡Cambios guardados de manera exitosa!", "¡Exito!");
        this.navRouter.navigate(["/usuarios"]);
      },
      error => {
        this.toastr.error(error.error[0].msg, "¡Error!");
      }
    );
    //notification
  }

  seleccionarUsuario(tipoUsuario: string) {
    this.selectUsuario = tipoUsuario;
    switch (tipoUsuario) {
      case "BUYER":
        this.usuariosService
          .obtenerDatosComboBox("BOSS")
          .subscribe((data: any[]) => {
            this.selectInfo = data;
          });
        break;
      case "BOSS":
        this.usuariosService
          .obtenerDatosComboBox("FINANCER")
          .subscribe((data: any[]) => {
            this.selectInfo = data;
          });
        break;
    }
    console.log(this.selectUsuario);
  }
}
