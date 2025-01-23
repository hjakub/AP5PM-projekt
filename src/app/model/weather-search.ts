export class WeatherSearch {
    city: string;
    country: string;
    temp: number;
    date: Date;

    constructor(city: string, country: string, temp: number, date: Date = new Date()) {
        this.city = city;
        this.country = country;
        this.temp = temp;
        this.date = date;
    }
}