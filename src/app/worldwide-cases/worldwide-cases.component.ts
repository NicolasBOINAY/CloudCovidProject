import { HttpClient } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CovidinfosService } from '../covidinfos.service';
import { DataWorld } from './DataWorld';
import { DataWorldInfos } from './DataWorldInfos';
import { MonthlyCases} from './MonthlyCases';
import { WeeklyCases} from './Weeklycases';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
import { CountryCasesComponent } from '../country-cases/country-cases.component';



@Component({
  selector: 'app-worldwide-cases',
  templateUrl: './worldwide-cases.component.html',
  styleUrls: ['./worldwide-cases.component.css'],
  
})
export class WorldwideCasesComponent implements OnInit {
  
  DataWorldInfos! : DataWorldInfos ;
  WeeklyCases! : WeeklyCases;
  MonthlyCases! : MonthlyCases;
  CovidUrl : string  = 'https://api.covid19api.com/summary';
  CovidUrl2 : string = "https://corona.lmao.ninja/v2/historical/all";
  CovidUrl3 : string = "https://corona.lmao.ninja/v2/historical/all?lastdays=8"

  check!: string;
  //ChartPie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  
  public pieChartLabels: Label[] = [['Dead Cases'], ['Recovered Cases'], ['Active Cases']];
  public pieChartData: SingleDataSet = [, , ];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  //BarChart
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['', '', '', '', '', ''];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [, , , , , ], label: 'Daily New Cases' },
    { data: [, , , , , ], label: 'Daily Deaths' },
    { data: [, , , , , ], label: 'Daily Recovered' }

  ];
  
  
  //LineChart
  lineChartData: ChartDataSets[] = [
    { data: [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ], label: 'Total Cases'},
    { data: [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ], label: 'Total Deaths'},
    { data: [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ], label: 'Total Recovered'}

  ];

  public lineChartLabels: Label[] = [] ;

  lineChartOptions = {
    responsive: true,
  };

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType = 'line';

  constructor(
    public covidinfosService: CovidinfosService,
    private http: HttpClient,
    private router: Router, private firestore: AngularFirestore
  ) {
    this.check = "";
   

   }
   async  goToPage(){
    this.router.navigate(["country-cases"]);
  }

  ngOnInit(): void {
    
  }
  getDataWorld(): Observable<DataWorld> {
    return this.http.get<DataWorld>(this.CovidUrl)
  }

  getMonthlyCases(): Observable<MonthlyCases> {
      return this.http.get<MonthlyCases>(this.CovidUrl2)
  }

  getWeeklyCases(): Observable<WeeklyCases> {
    return this.http.get<WeeklyCases>(this.CovidUrl3)
}
  
  
  
  displayWorldData(){
    var todaydate = (new Date()).toISOString().slice(0,10);
    this.covidinfosService.getDataFromFirebase().subscribe((data:any)=>{
      this.DataWorldInfos = data;
      if(this.DataWorldInfos == undefined || this.DataWorldInfos.Date<todaydate){
        this.getDataWorld().subscribe(data =>{
          this.DataWorldInfos = data.Global;
          this.DataWorldInfos.MortalityRate = ((this.DataWorldInfos.TotalDeaths/this.DataWorldInfos.TotalConfirmed)*100).toFixed(2);
          this.DataWorldInfos.RecoveryRate = ((this.DataWorldInfos.TotalRecovered/this.DataWorldInfos.TotalConfirmed)*100).toFixed(2);
          this.DataWorldInfos.ActiveCases = (this.DataWorldInfos.TotalConfirmed - this.DataWorldInfos.TotalRecovered)-this.DataWorldInfos.TotalDeaths;
          this.DataWorldInfos.Date = todaydate;
          this.covidinfosService.updateCovidData(this.DataWorldInfos);
        
          this.DisplayTable(this.DataWorldInfos);
          this.ShowPieChart();
      })
        
      }
      else{
        this.covidinfosService.getDataFromFirebase().subscribe((data: any)=>{
          this.DisplayTable(this.DataWorldInfos);
          this.ShowPieChart();
      })
      }
      
    })
  }

  DisplayTable(data: DataWorldInfos){
    var text = "<td>" + data.NewConfirmed + "</td>";
    text+="<td>" + data.TotalConfirmed + "</td>";
    text+="<td>" + data.ActiveCases + "</td>";
    text+="<td>" + data.NewDeaths + "</td>";
    text+="<td>" + data.TotalDeaths + "</td>";
    text+="<td>" + data.MortalityRate + "</td>";
    text+="<td>" + data.NewRecovered + "</td>";
    text+="<td>" + data.TotalRecovered + "</td>";
    text+="<td>" + data.RecoveryRate + "</td>";

    document.getElementById("table")!.innerHTML = text;
  }

  ShowPieChart(){
    this.pieChartData[0] = this.DataWorldInfos.TotalDeaths;
    this.pieChartData[1] = this.DataWorldInfos.TotalRecovered;
    this.pieChartData[2] = this.DataWorldInfos.ActiveCases;
    }

  
    DisplayWeeklyData(){
      var todaydate = (new Date()).toISOString().slice(0,10);
      this.covidinfosService.getWeeklyFromFirebase().subscribe((data:any)=>{
        this.WeeklyCases = data;
        if(this.WeeklyCases == undefined || this.WeeklyCases.date<todaydate){
          this.getWeeklyCases().subscribe(data =>{
            this.WeeklyCases = data;
            this.WeeklyCases.date = todaydate;
            this.covidinfosService.updateWeeklyData(this.WeeklyCases);
            this.ShowBarChart();
  
          })
          
        }
        else{
          this.covidinfosService.getWeeklyFromFirebase().subscribe((data: any)=>{
            this.ShowBarChart();
            
        })
        }
        
      })
  
    }

  DisplayMonthlyData(){
    var todaydate = (new Date()).toISOString().slice(0,10);
    this.covidinfosService.getMonthlyFromFirebase().subscribe((data:any)=>{
      this.MonthlyCases = data;
      if(this.MonthlyCases == undefined || this.MonthlyCases.date<todaydate){
        this.getMonthlyCases().subscribe(data =>{
          this.MonthlyCases = data;
          this.MonthlyCases.date = todaydate;
          this.covidinfosService.updateMonthlyData(this.MonthlyCases);
          this.ShowLineChart();

        })
        
      }
      else{
        this.covidinfosService.getMonthlyFromFirebase().subscribe((data: any)=>{
          this.ShowLineChart();
          
      })
      }
      
    })

  }


  
  
  ShowLineChart(){
    var listdates = []
    var label: Label = '';
    for (let i in this.MonthlyCases.cases){
      listdates.push(Date.parse(i));
    }
    console.log(listdates);
    var listedatestriee = function compare(a: any, b: any) {
      if (a < b)
         return -1;
      if (a > b)
         return 1;
      // a doit être égal à b
      return 0;
    }
    listdates.sort(listedatestriee);
    var liste = Array(30).join(".").split(".");;
    
    for (let i=0; i<listdates.length; i++){
    
      liste[i] = new Date(listdates[i]).toLocaleDateString("en-US").toString();
    
    }
    this.lineChartLabels = liste;
    
    
    console.log(this.lineChartLabels);
    
    var listcases = []
    for (let i in this.MonthlyCases.cases){
      listcases.push(this.MonthlyCases.cases[i])
    }
    
    listcases.sort(function(a, b) {
      return a - b;
    });
    this.lineChartData[0].data = listcases;

    var listdeaths = []
    for (let i in this.MonthlyCases.deaths){
      listdeaths.push(this.MonthlyCases.deaths[i])
    }
    
    listdeaths.sort(function(a, b) {
      return a - b;
    });
    this.lineChartData[1].data = listdeaths;

    var listrecovered = []
    for (let i in this.MonthlyCases.recovered){
      listrecovered.push(this.MonthlyCases.recovered[i])
    }
    
    listrecovered.sort(function(a, b) {
      return a - b;
    });
    console.log(listrecovered);
    this.lineChartData[2].data = listrecovered;



    

  }

  ShowBarChart(){

    
    var listdates = []
    for (let i in this.WeeklyCases.cases){
      listdates.push(Date.parse(i));
    }
    var listedatestriee = function compare(a: any, b: any) {
      if (a < b)
         return -1;
      if (a > b)
         return 1;
      // a doit être égal à b
      return 0;
    }
    
    console.log("ok");
    listdates.sort(listedatestriee);
    var liste = Array(8).join(".").split(".");;
    
    for (let i=0; i<listdates.length; i++){
    
      liste[i] = new Date(listdates[i]).toLocaleDateString("en-US").toString();
    
    }
    
    this.barChartLabels = liste;
    
    
    
    var listcases = []
    var listcases2 =[]
    listcases2[0]= 0
    for (let i in this.WeeklyCases.cases){
      listcases.push(this.WeeklyCases.cases[i])
    }
    
    listcases.sort(function(a, b) {
      return a - b;
    });
   
    for (let i=1; i<9; i++){
      listcases2[i]=(listcases[i]-listcases[i-1])
    }
    this.barChartData[0].data = listcases2;

    var listdeaths = []
    var listdeaths2 = []
    listdeaths2[0] = 0 
    for (let i in this.WeeklyCases.deaths){
      listdeaths.push(this.WeeklyCases.deaths[i])
    }
    
    listdeaths.sort(function(a, b) {
      return a - b;
    });
    for (let i=1; i<9; i++){
      listdeaths2[i]=(listdeaths[i]-listdeaths[i-1])
    }
    this.barChartData[1].data = listdeaths2;

    var listrecovered = []
    var listrecovered2 = []
    listrecovered2[0] = 0
    for (let i in this.WeeklyCases.recovered){
      listrecovered.push(this.WeeklyCases.recovered[i])
    }
    
    listrecovered.sort(function(a, b) {
      return a - b;
    });
    for (let i=1; i<9; i++){
      listrecovered2[i]=(listrecovered[i]-listrecovered[i-1])
    }
    this.barChartData[2].data = listrecovered2;

  }


}


  


