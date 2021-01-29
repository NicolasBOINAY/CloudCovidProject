export class HistoricalCountry {
    cases : any;
    deaths : any;
    recovered : any;
    date : any;

    constructor(cases: any,deaths: any, recovered: any, date: any){
        this.cases = cases;
        this.deaths = deaths;
        this.recovered = recovered;
        this.date = date;
    }


}