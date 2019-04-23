import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css']
})
export class FilmComponent implements OnInit {

  // private _title:string;

  // @Input() set title(title:string) {
  //   this._title = title;
  // };

  // get title() {
  //   return this._title;
  //
  // }

  @Input() film;



  constructor() {
    // this.title = " [ no title set ] ";
  }

  ngOnInit() {
  }

}
