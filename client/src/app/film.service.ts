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
  getFilm(id) {
    return this.http.get(this.apiurl + 'api/films/' + id);

  }

  deleteFilm(id) {
    return this.http.delete(this.apiurl + 'api/films/' + id);

  }
  createFilm(filmObject) {
    console.log("In film.service, createfilm()");
    console.log(filmObject);
    return this.http.post(this.apiurl + 'api/films/', filmObject);
  }

  updateFilm(id, data) {
    return this.http.put(this.apiurl + 'api/films/' + id, data);

  }
  constructor(private http: HttpClient) { }
}
