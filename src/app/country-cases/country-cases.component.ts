import { HttpClient } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CovidinfosService } from '../covidinfos.service';
import { DataCountry } from './DataCountry';
import { DataCountryInfo } from './DataCountryInfo';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
import { HistoricalCountry } from './HistoricalCountry';
import { HistoricalCountryGlobal } from './HistoricalCountryGlobal';




@Component({
  selector: 'app-country-cases',
  templateUrl: './country-cases.component.html',
  styleUrls: ['./country-cases.component.css']
})
export class CountryCasesComponent implements OnInit {

  DataCountryInfoList! : DataCountryInfo[] ;
  country!: DataCountryInfo;
  historycountryList!: HistoricalCountry[];
  historycountry!: HistoricalCountry;
  CovidUrl : string  = 'https://api.covid19api.com/summary';
  CovidUrl2 : string = 'https://disease.sh/v3/covid-19/historical/';
  CovidUrl4 : string = '';

  DataCountryAll =[];
  CovidUrl3 : string = "https://api.covid19api.com/total/dayone/country/";

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
    { data: [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,], label: 'Total Cases'},
    { data: [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,], label: 'Total Deaths'},
    { data: [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,], label: 'Total Recovered'}

  ];

  lineChartLabels: Label[] = [ [''],[''], [''], [''], [''], [''],[''] ,[''], [''], [''], [''], [''], [''],[''] ,[''], [''],[''] ,[''] ,[''] ,[''] ,[''] ,[''] ,[''] , [''],[''] ,[''] ,[''] ,[''] ,[''] ,[''] ];

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
  ) { }

  async  goToPage(pageName:string){
    this.router.navigate(["worldwide-cases"]);
  }

  ngOnInit(): void {
    this.getDataCountry().subscribe(data => {
      this.DataCountryInfoList = data.Countries;
      this.getCountries();
    });
    

  }

  getDataCountry(): Observable<DataCountry> {
    return this.http.get<DataCountry>(this.CovidUrl)
  }

 
  getHistoryCountry(url : string): Observable<HistoricalCountryGlobal> {
    return this.http.get<HistoricalCountryGlobal>(url)
}

  displayCountryData(){
    var todaydate = (new Date()).toISOString().slice(0,10);
    var countryname = (<HTMLInputElement>document.querySelector("#select_countries")).value;
    this.covidinfosService.getCountryDataFromFirebase().subscribe((data:any)=>{
      if(this.country == undefined || this.country.Date<todaydate){
        
        this.getDataCountry().subscribe(data =>{
          this.DataCountryInfoList = data.Countries;
          this.country = data.Countries;
          this.country.MortalityRate = ((this.country.TotalDeaths/this.country.TotalConfirmed)*100).toFixed(2);
          this.country.RecoveryRate = ((this.country.TotalRecovered/this.country.TotalConfirmed)*100).toFixed(2);
          this.country.ActiveCases = this.country.TotalConfirmed - this.country.TotalRecovered-this.country.TotalDeaths;
          console.log(this.country.ActiveCases);
          this.country.Date = todaydate;
          this.country =  this.DataCountryInfoList.find(x => x.Country === countryname);
          console.log(this.country);
          this.covidinfosService.updateCountryData(this.country);
          this.covidinfosService.updateCountryAll({listAll : this.DataCountryAll});
          this.DisplayTable(this.country);
          this.ShowPieChart();

          })
        
      }
      else{
        this.country.MortalityRate = ((this.country.TotalDeaths/this.country.TotalConfirmed)*100).toFixed(2);
        this.country.RecoveryRate = ((this.country.TotalRecovered/this.country.TotalConfirmed)*100).toFixed(2);
        this.country.ActiveCases = this.country.TotalConfirmed - this.country.TotalRecovered-this.country.TotalDeaths;
        console.log(this.country.ActiveCases);
        this.covidinfosService.getCountryDataFromFirebase().subscribe((data: any)=>{
          this.country = data;
          this.country =  this.DataCountryInfoList.find(x => x.Country === countryname);
          this.DisplayTable(this.country);
          
          this.ShowPieChart();

          
      })
      }
      
      
    })
  }

  DisplayWeeklyData(){
    var todaydate = (new Date()).toISOString().slice(0,10);
    var countryname = (<HTMLInputElement>document.querySelector("#select_countries")).value;
    this.CovidUrl4 = "https://disease.sh/v3/covid-19/historical/" + countryname +"?lastdays=7";
    console.log(this.CovidUrl4);
    this.covidinfosService.getHistoryFromFirebase().subscribe((data:any)=>{
      if(this.historycountry == undefined || this.historycountry.date<todaydate){
        this.getHistoryCountry(this.CovidUrl4).subscribe(data =>{

          this.historycountry = data.timeline;
          this.historycountry.date = todaydate;
          this.covidinfosService.updateHistoryCountry(this.historycountry);
          this.ShowBarChart();

        })
        
      }
      else{
        this.covidinfosService.getHistoryFromFirebase().subscribe((data: any)=>{
          this.historycountry = data.timeline;
          this.ShowBarChart();
          
      })
      }
      
    })

  }

  DisplayHistoryData(){
    var todaydate = (new Date()).toISOString().slice(0,10);
    var countryname = (<HTMLInputElement>document.querySelector("#select_countries")).value;
    this.CovidUrl4 = "https://disease.sh/v3/covid-19/historical/" + countryname;
    console.log(this.CovidUrl4);
    this.covidinfosService.getHistoryFromFirebase().subscribe((data:any)=>{
      if(this.historycountry == undefined || this.historycountry.date<todaydate){
        this.getHistoryCountry(this.CovidUrl4).subscribe(data =>{

          this.historycountry = data.timeline;
          this.historycountry.date = todaydate;
          this.covidinfosService.updateHistoryCountry(this.historycountry);
          this.ShowLineChart();

        })
        
      }
      else{
        this.covidinfosService.getHistoryFromFirebase().subscribe((data: any)=>{
          this.historycountry = data.timeline;
          this.ShowLineChart();
          
      })
      }
      
    })

  }

  DisplayTable(data: DataCountryInfo){
    var text = "<td>"+ this.country.Country+ "</td>";
    text += "<td>"+ this.country.CountryCode+ "</td>";
    text += "<td>"+ this.country.Slug+ "</td>";
    text += "<td>"+ this.country.NewConfirmed+ "</td>";
    text += "<td>"+ this.country.TotalConfirmed+ "</td>";
    text += "<td>"+ this.country.ActiveCases+ "</td>";
    text += "<td>"+ this.country.NewDeaths+ "</td>";
    text += "<td>"+ this.country.TotalDeaths+ "</td>";
    text += "<td>"+ this.country.MortalityRate+ "</td>";
    text += "<td>"+ this.country.NewRecovered+ "</td>";
    text += "<td>"+ this.country.TotalRecovered+ "</td>";
    text += "<td>"+ this.country.RecoveryRate+ "</td>";
    text += "<td>"+ this.country.Date.substring(0,10)+ "</td>";

    document.querySelector("#table")!.innerHTML = text;
  }

  ShowPieChart(){
    this.pieChartData[0] = this.country.TotalDeaths;
    this.pieChartData[1] = this.country.TotalRecovered;
    this.pieChartData[2] = this.country.ActiveCases;
    }

  ShowLineChart(){
    var countryname = (<HTMLInputElement>document.querySelector("#select_countries")).value;
    this.CovidUrl4 = "https://disease.sh/v3/covid-19/historical/" + countryname;
    this.getHistoryCountry(this.CovidUrl4).subscribe(data=>{
    this.historycountry = data.timeline;
    var listdates = []
    for (let i in this.historycountry.cases){
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
    for (let i=0; i<listdates.length; i++){
    listdates[i] = new Date(listdates[i]).toLocaleDateString("en-US")
    }
    console.log(listdates);
    this.lineChartLabels = listdates;
    
    
    
    var listcases = []
    for (let i in this.historycountry.cases){
      listcases.push(this.historycountry.cases[i])
    }
    
    this.lineChartData[0].data = listcases;

    var listdeaths = []
    for (let i in this.historycountry.deaths){
      listdeaths.push(this.historycountry.deaths[i])
    }
   
    this.lineChartData[1].data = listdeaths;

    var listrecovered = []
    for (let i in this.historycountry.recovered){
      listrecovered.push(this.historycountry.recovered[i])
    }
    
    this.lineChartData[2].data = listrecovered;
  })



    

  }
ShowBarChart(){
  var countryname = (<HTMLInputElement>document.querySelector("#select_countries")).value;
  this.CovidUrl4 = "https://disease.sh/v3/covid-19/historical/" + countryname +"?lastdays=7";
  this.getHistoryCountry(this.CovidUrl4).subscribe(data=>{
    this.historycountry = data.timeline;
    var listdates = []
      for (let i in this.historycountry.cases){
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
      listdates.sort(listedatestriee);
      for (let i=0; i<listdates.length; i++){
      listdates[i] = new Date(listdates[i]).toLocaleDateString("en-US")
      }
      this.barChartLabels = listdates;
      
      
      
      var listcases = []
      var listcases2 =[]
      listcases2[0]= 0
      for (let i in this.historycountry.cases){
        listcases.push(this.historycountry.cases[i])
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
      for (let i in this.historycountry.deaths){
        listdeaths.push(this.historycountry.deaths[i])
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
      for (let i in this.historycountry.recovered){
        listrecovered.push(this.historycountry.recovered[i])
      }
      
      listrecovered.sort(function(a, b) {
        return a - b;
      });
      for (let i=1; i<9; i++){
        listrecovered2[i]=(listrecovered[i]-listrecovered[i-1])
      }
      this.barChartData[2].data = listrecovered2;

  })

  }



getCountries(){
    var options="";
    for(let i=0;i<this.DataCountryInfoList.length;i++){
      options += "<option>" + this.DataCountryInfoList[i].Country + "</option>";
    }
    document.querySelector("#select_countries")!.innerHTML = options;
    
  }
  

 

}
