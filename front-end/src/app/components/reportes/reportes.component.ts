import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { ReqisicionesService } from 'src/app/services/reqisiciones.service';

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.css"],
})
export class ReportesComponent implements OnInit {
  constructor(public requesiciones:ReqisicionesService) {}

  ngOnInit() {
    this.chartInit();
  }
 
  chartInit() {
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
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
            ],
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

    //Initialize Pie Chart
    var pieChart = new Chart("pieChart", {
      type: "pie",
      data: {
        labels: ["Rechazadas", "Aprobadas"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {},
    });
  }
}
