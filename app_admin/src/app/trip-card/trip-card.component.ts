import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { AuthenticationService } from '../services/authentication.service';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent implements OnInit {

  @Input('trip') trip: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private tripDataService: TripDataService
  ) { }

  // Stores the rating selected by the user
  selectedRating: number = 0;

  // Tracks the rating submission status
  isSubmittingRating: boolean = false;

  // Displays feedback after submitting a rating
  ratingMessage: string = '';

  ngOnInit(): void {
    // Load the existing trip rating, if one is available
    this.selectedRating = this.trip.rating ?? 0;
  }

  public editTrip(trip: Trip) {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  public deleteTrip(trip: Trip): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      this.tripDataService.deleteTrip(trip.code)
        .subscribe({
          next: () => {
            window.location.reload();
          },
          error: (error: any) => {
            console.log('Error: ' + error);
          }
        });
    }
  }

  // Submits a rating for the selected trip
  public submitRating(): void {
    if (this.selectedRating < 1 || this.selectedRating > 5) {
      this.ratingMessage = 'Please select a rating between 1 and 5 stars.';
      return;
    }

    this.isSubmittingRating = true;
    this.ratingMessage = '';

    this.tripDataService.rateTrip(this.trip.code, this.selectedRating)
      .subscribe({
        next: (updatedTrip: Trip) => {
          // Update the displayed rating
          this.trip.rating = updatedTrip.rating;
          this.ratingMessage = 'Rating saved successfully.';
          this.isSubmittingRating = false;
        },
        error: (error: any) => {
          console.log('Error submitting rating:', error);
          this.ratingMessage = 'Unable to save rating. Please try again.';
          this.isSubmittingRating = false;
        }
      });
  }

  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }
}
