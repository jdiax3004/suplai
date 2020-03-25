import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { ToastrModule } from "ngx-toastr";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SidebarComponent } from "./components/shared/sidebar/sidebar.component";
import { NavbarComponent } from "./components/shared/navbar/navbar.component";
import { FooterComponent } from "./components/shared/footer/footer.component";
import { UsuariosComponent } from "./components/usuarios/usuarios.component";
import { RequisicionesComponent } from "./components/requisiciones/requisiciones.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/shared/login/login.component";
import { RegistroComponent } from "./components/shared/registro/registro.component";
import { ReportesComponent } from "./components/reportes/reportes.component";
import { AgregarUsuarioComponent } from "./components/agregar-usuario/agregar-usuario.component";
import { AgregarRequisicionComponent } from "./components/agregar-requisicion/agregar-requisicion.component";
import { HttpClientModule } from "@angular/common/http";
import { UsuarioComponent } from "./components/usuario/usuario.component";
import { RequisicionComponent } from "./components/requisicion/requisicion.component";
import { StatusPipe } from "./pipes/status.pipe";
import { UserStatusPipe } from "./pipes/user-status.pipe";
import { UserRolePipe } from "./pipes/user-role.pipe";
import { AvoidNullPipe } from "./pipes/avoid-null.pipe";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    UsuariosComponent,
    RequisicionesComponent,
    HomeComponent,
    LoginComponent,
    RegistroComponent,
    ReportesComponent,
    AgregarUsuarioComponent,
    AgregarRequisicionComponent,
    UsuarioComponent,
    RequisicionComponent,
    StatusPipe,
    UserStatusPipe,
    UserRolePipe,
    AvoidNullPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
