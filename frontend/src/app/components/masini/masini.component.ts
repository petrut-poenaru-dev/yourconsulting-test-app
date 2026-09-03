import { Component, OnInit } from '@angular/core';

import { Car } from '../../models/car.model';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-masini',
  templateUrl: './masini.component.html',
  styleUrls: ['./masini.component.scss']
})
export class MasiniComponent implements OnInit {
  cars: Car[] = [];
  loading = false;
  error = '';

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.loading = true;
    this.error = '';
    this.carService.findAll().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.loading = false;
      },
      error: () => {
        this.error = 'Nu s-au putut încărca mașinile.';
        this.loading = false;
      }
    });
  }
}
