import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmService } from '../film.service';

@Component({
  selector: 'app-filmdetail',
  templateUrl: './filmdetail.component.html',
  styleUrls: ['./filmdetail.component.css']
})
export class FilmdetailComponent implements OnInit {
  film:any;           //store the film object
  filmurl:string='';  //needed?
  editing:boolean=false;
  title = 'Film Logger';


  constructor(private route: ActivatedRoute,
              private router: Router,
              private filmService: FilmService ) { }

  ngOnInit() {
    this.getFilm();
  }

  setEditMode(mode):void {
    this.editing = (mode ? true : false);

  }

  deleteFilm():void {
    if (confirm(`Are you sure you want to delete ${this.film.title}?`)) {
        this.filmService.deleteFilm(this.film._id)
          .subscribe((result) => {
            alert(`Film ${this.film.title} has been deleted.`);
            this.router.navigate(['/gallery']);
          })
    }


  }
  getFilm(): void {
    const param = this.route.snapshot.paramMap.get('id');
    this.filmService.getFilm(param)
      .subscribe((film) => {
        this.film = film;
        //create URL
      })
  }

  updateFilm(obj:any):void {
    this.film.rating = obj.rating;

    this.filmService.updateFilm(this.film._id, this.film)
      .subscribe((result) => {
        this.router.navigate(['films/:id']);
        // location.reload();
      })
  }
}
