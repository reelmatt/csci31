import { Component, OnInit } from '@angular/core';
import { FilmService } from '../film.service';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [FilmService]
})
export class GalleryComponent implements OnInit {

  title = 'Film Logger';
  filmList = null;

  constructor(private filmService: FilmService) { }

  ngOnInit() {
    this.updateFilmList();
  }

  updateFilmList():void {
    this.filmService.listFilms().subscribe((films) => {
      this.filmList = films;
      console.log(this.filmList);
    });
  }
}
