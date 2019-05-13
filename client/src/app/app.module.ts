import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilmComponent } from './film/film.component';
import { GalleryComponent } from './gallery/gallery.component';

import { RouterModule, Routes } from '@angular/router';
import { FilmdetailComponent } from './filmdetail/filmdetail.component';
import { FormsModule } from '@angular/forms';
import { NewfilmComponent } from './newfilm/newfilm.component';

const routes: Routes = [
  { path: '', redirectTo: '/gallery', pathMatch: 'full'},
  { path: 'gallery', component: GalleryComponent },
  { path: 'films/:id', component: FilmdetailComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    FilmComponent,
    GalleryComponent,
    FilmdetailComponent,
    NewfilmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      routes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
