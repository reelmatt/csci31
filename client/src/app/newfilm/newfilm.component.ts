import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilmService } from '../film.service';

@Component({
  selector: 'app-newfilm',
  templateUrl: './newfilm.component.html',
  styleUrls: ['./newfilm.component.css']
})
export class NewfilmComponent implements OnInit {
  //could make a Film class and do film:Film
  film:any = {};  //bound to the form fields b/c of double-binding
  errorMsg = '';

  @Output() newFilm = new EventEmitter();

  constructor(private filmService:FilmService) {

  }

  ngOnInit() {
  }

  save(newfilmForm):void {
    // this.film.rating = newfilmForm.rating;
    // this.film.name = newfilmForm.name;

    console.log("in NewfilmComponent, save()");
    console.log(newfilmForm);
    console.log(this.film);
    this.errorMsg = '';

    this.filmService.createFilm(this.film)
        .subscribe((film) => {
              console.log(film);
              this.newFilm.emit();
              newfilmForm.reset();
            },
            (err) => {
              this.errorMsg = 'An error occurred';
              if (err.status && err.status === 404) {
                this.errorMsg = `Could not find requested film ${this.film.title}`;
              }
            });

  }

}
