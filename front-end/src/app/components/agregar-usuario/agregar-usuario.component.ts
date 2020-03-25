import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UsuariosService } from "../../services/usuarios.service";
//ToastrService
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-agregar-usuario",
  templateUrl: "./agregar-usuario.component.html",
  styleUrls: ["./agregar-usuario.component.css"]
})
export class AgregarUsuarioComponent implements OnInit {
  selectInfo: any[] = [];
  selectUsuario: string;

  forma: FormGroup;
  constructor(
    private usuariosService: UsuariosService,
    private toastr: ToastrService
  ) {
    this.forma = new FormGroup({
      nombre: new FormControl("", Validators.required),
      apellidos: new FormControl("", Validators.required),
      correo: new FormControl("", [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
      ]),
      contrasena: new FormControl("", Validators.required),
      tipoUsuario: new FormControl({}),
      jefeUsuario: new FormControl({})
    });
  }

  ngOnInit() {}

  guardarCambios() {
    console.log(this.forma.value);
    console.log(this.forma);
    this.usuariosService
      .crearUsuario(this.forma.value)
      .subscribe(data => console.log(data));
      //notification
    this.toastr.success("¡Usuario guardado exitosamente!", "¡Exito!");
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
