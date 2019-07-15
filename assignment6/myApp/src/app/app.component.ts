import { Component, OnInit } from '@angular/core';
import { FilmService } from './film.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FilmService]
})
export class AppComponent {
  title = 'Film Logger';
  filmList = null;

  constructor(private filmService: FilmService) { }

  ngOnInit() {
    this.filmService.listFilms().subscribe((films) => {
      this.filmList = films;
      console.log(this.filmList);
    });
  }
}
