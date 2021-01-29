export class DataCountryInfo{
    Country : string;
    CountryCode: string;
    Slug: string;
    NewConfirmed : number;
    TotalConfirmed: number;
    NewDeaths: number;
    TotalDeaths: number;
    NewRecovered: number;
    TotalRecovered: number;
    Date : string;
    RecoveryRate : string;
    MortalityRate : string;
    ActiveCases : number;


constructor(Country: string,CountryCode: string,Slug: string,NewConfirmed: number,TotalConfirmed: number,NewDeaths: number,TotalDeaths: number,NewRecovered: number,TotalRecovered: number,Date: string,ActiveCases: number,RecoveryRate: string,MortalityRate: string){
    this.Country = Country;
    this.CountryCode = CountryCode;
    this.Slug = Slug;
    this.NewConfirmed = NewConfirmed;
    this.TotalConfirmed = TotalConfirmed;
    this.NewDeaths = NewDeaths;
    this.TotalDeaths = TotalDeaths;
    this.NewRecovered = NewRecovered;
    this.TotalRecovered = TotalRecovered;
    this.Date = Date;
    this.ActiveCases = ActiveCases;
    this.MortalityRate = MortalityRate;
    this.RecoveryRate = RecoveryRate
}
}