// src/app/movie-card/movie-card.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (!user) {
      this.router.navigate(['welcome']);
      return;
    }

    this.getMovies();
  }

  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id);
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
  /**
   * Opens the genre dialog with additional information
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: genre.Name,
        content: genre.Description,
      },
    });
  }

  /**
   * Opens the synopsis dialog showing the movie description
   */
  openSynopsisDialog(synopsis: string): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: 'Description',
        content: synopsis,
      },
    });
  }

  /**
   * Opens the director dialog with additional information
   */
  openDirectorDialog(director: any): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: director.Name,
        content: director.Bio,
      },
    });
  }

  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('added to favorites', 'OK', {
        duration: 2000,
      });
    });
  }

  removeFavorite(id: string): void {
    this.fetchApiData.removeFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('removed from favorites', 'OK', {
        duration: 2000,
      });
    });
  }
}
