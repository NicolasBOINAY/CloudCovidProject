export class DataWorldInfos{
    NewConfirmed : any;
    TotalConfirmed : any;
    ActiveCases : any;
    NewDeaths : any;
    TotalDeaths : any;
    MortalityRate : any;
    NewRecovered : any;
    TotalRecovered : any;
    RecoveryRate : any;
    Date: any;


    constructor(newconfirmed: any, totalconfirmed: any, activecases: any, newdeaths: any, totaldeaths: any, mortalityrate: any, newrecovered: any, totalrecovered: any, recoveryrate: any, date: any){
        this.NewConfirmed = newconfirmed;
        this.TotalConfirmed = totalconfirmed;
        this.ActiveCases = activecases;
        this.NewDeaths = newdeaths;
        this.TotalDeaths = totaldeaths;
        this.MortalityRate = mortalityrate;
        this.NewRecovered = newrecovered;
        this.TotalRecovered = totalrecovered;
        this.RecoveryRate = recoveryrate;
        this.Date = date;

    }
}