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

    this.filmService.createFilm(this.film)
      .subscribe((film) => {
        console.log(film);
        this.newFilm.emit();
        newfilmForm.reset();
      });

  }

}
