import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { ReqisicionesService } from "src/app/services/reqisiciones.service";
import { ReportesService } from "src/app/services/reportes.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.css"],
})
export class ReportesComponent implements OnInit {
  constructor(
    public requesiciones: ReqisicionesService,
    public reporteService: ReportesService,
    public auth: AuthService
  ) {}

  approvedCounter = {};
  deniedCounter = 0;

  ngOnInit() {
    this.chartInit();
  }

  async getStats() {
    // this.reporteService.obtenerCounter({ status: 2 }).subscribe((data: any) => {
    //   this.approvedCounter = data;
    //   console.log(this.approvedCounter);
    // });
    this.approvedCounter = (await this.reporteService.obtenerCounter({status:2}).toPromise());
  }

  async chartInit() {
    await this.getStats();
    //Initialize Bar Chart
    var barChart = new Chart("barChart", {
      type: "bar",
      data: {
        labels: ["Red", "Blue"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
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
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {},
    });
  }
}
