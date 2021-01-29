export class HistoricalCountryGlobal {
    country : string;
    province : [];
    timeline : any

    constructor(country: any, province: any, timeline : any){
        this.country = country;
        this.province = province;
        this.timeline = timeline;
    }
}