import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  private apiurl = environment.apiurl;

  listFilms() {
    return this.http.get(this.apiurl + 'api/films');
  }

  constructor(private http: HttpClient) { }
}
