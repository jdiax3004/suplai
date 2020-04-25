import { Component, OnInit } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import { ReportesService } from 'src/app/services/reportes.service';
import { Chart } from "chart.js";
import { AuthService } from "src/app/services/auth.service";


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
  constructor(public usuariosService: UsuariosService, public reporteService:ReportesService)  {}
  approvedCounter = {};
  deniedCounter = {};
  ngOnInit() {
    this.getStats(12);
    this.usuariosService.getStats().subscribe((response: any) => {
      console.log(response);
      this.approvedBudget = response.approvedBudget;
      this.totalRequisitions = response.totalRequisitions;
      this.totalApprovedRequisitions = response.totalApprovedRequisitions;
      this.totalDeniedRequisitions = response.totalDeniedRequisitions;
      this.totalPendingRequisitions = response.totalPendingRequisitions;
    });
  }


  async getStats(interval?: number) {
    // this.reporteService.obtenerCounter({ status: 2 }).subscribe((data: any) => {
    //   this.approvedCounter = data;
    //   console.log(this.approvedCounter);
    // });
    this.approvedCounter = await this.reporteService
      .obtenerCounter({ status: 2, time: interval })
      .toPromise();
    this.deniedCounter = await this.reporteService
      .obtenerCounter({ status: 3, time: interval })
      .toPromise();
      this.chartInit();
  }

  async chartInit() {

    //Initialize Bar Chart
    var barChart = new Chart("barChart", {
      type: "bar",
      data: {
        labels: ["Rechazadas", "Aprobadas"],
        datasets: [
          {
            label: ["Rechazadas","Aprobadas"],
            data: [this.deniedCounter, this.approvedCounter],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(75, 192, 192, 0.2)"
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
    console.log("Hola" + this.approvedCounter);
    //Initialize Pie Chart
    var pieChart = new Chart("pieChart", {
      type: "pie",
      data: {
        labels: ["Rechazadas", "Aprobadas"],
        datasets: [
          {
            label: "Solicitudes",
            data: [this.deniedCounter, this.approvedCounter],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(75, 192, 192, 0.2)"
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
            borderWidth: 1
          }
        ]
      },
      options: {}
    });

    var financer3 = new Chart("financer3", {
      type: "bar",
      data: {
        labels: ['Febrero 20','Marzo 20','Abril 20'],
        datasets: [
          {
            label: "Ganancias por Mes",
            data: [2,2,2],
            backgroundColor: [
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)"
            ],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

    var financer6 = new Chart("financer6", {
      type: "bar",
      data: {
        labels: ['Noviembre 19','Diciembre 19','Enero 20','Febrero 20','Marzo 20','Abril 20'],
        datasets: [
          {
            label: "Ganancias por Mes",
            data: [2,2,2,2,2,2],
            backgroundColor: [

              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)"
            ],
            borderColor: [ 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)','rgba(54, 162, 235, 1)'],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

    var financer12 = new Chart("financer12", {
      type: "bar",
      data: {
        labels: ['Abril 19', 'Mayo 19','Junio 19','Julio 19','Agosto 19','Setiembre 19','Octubre 19','Noviembre 19','Diciembre 19','Enero 20','Febrero 20','Marzo 20','Abril 20'],
        datasets: [
          {
            label: "Ganancias por Mes",
            data: [2,2,2,2,2,2,2,2,2,2,2,2,2],
            backgroundColor: [
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)"
            ],
            borderColor: [ 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

  }
}
