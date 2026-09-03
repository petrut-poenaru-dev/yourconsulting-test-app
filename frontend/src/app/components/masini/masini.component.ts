import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Car, CarPayload } from '../../models/car.model';
import { CarService } from '../../services/car.service';

const FIELD_LABELS: Record<string, string> = {
  denumire_marca: 'Denumire marcă',
  denumire_model: 'Denumire model',
  an_fabricatie: 'Anul fabricației',
  capacitate_cilindrica: 'Capacitatea cilindrică'
};

@Component({
  selector: 'app-masini',
  templateUrl: './masini.component.html',
  styleUrls: ['./masini.component.scss']
})
export class MasiniComponent implements OnInit {
  cars: Car[] = [];
  loading = false;
  error = '';

  modalOpen = false;
  editingId: number | null = null;
  submitted = false;
  saving = false;
  saveError = '';

  form: FormGroup = this.fb.group({
    denumire_marca: ['', [Validators.required, Validators.maxLength(255)]],
    denumire_model: ['', [Validators.required, Validators.maxLength(255)]],
    an_fabricatie: [null, [Validators.required, Validators.min(1), Validators.max(9999)]],
    capacitate_cilindrica: [null, [Validators.required, Validators.min(1), Validators.max(9999)]]
  });

  constructor(private carService: CarService, private fb: FormBuilder) {}

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

  get taxaImpozit(): number {
    const cc = Number(this.form.get('capacitate_cilindrica')?.value);
    if (!cc || cc <= 0) {
      return 0;
    }
    if (cc < 1500) {
      return 50;
    }
    if (cc <= 2000) {
      return 100;
    }
    return 200;
  }

  get validationErrors(): string[] {
    return Object.keys(FIELD_LABELS)
      .filter((key) => this.form.get(key)?.invalid)
      .map((key) => `Câmpul "${FIELD_LABELS[key]}" este obligatoriu.`);
  }

  openCreate(): void {
    this.editingId = null;
    this.submitted = false;
    this.saveError = '';
    this.form.reset();
    this.modalOpen = true;
  }

  openEdit(car: Car): void {
    this.editingId = car.id;
    this.submitted = false;
    this.saveError = '';
    this.form.setValue({
      denumire_marca: car.denumire_marca,
      denumire_model: car.denumire_model,
      an_fabricatie: car.an_fabricatie,
      capacitate_cilindrica: car.capacitate_cilindrica
    });
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  submit(): void {
    this.submitted = true;
    this.saveError = '';

    if (this.form.invalid) {
      return;
    }

    const payload: CarPayload = {
      denumire_marca: this.form.value.denumire_marca,
      denumire_model: this.form.value.denumire_model,
      an_fabricatie: Number(this.form.value.an_fabricatie),
      capacitate_cilindrica: Number(this.form.value.capacitate_cilindrica),
      taxa_impozit: this.taxaImpozit
    };

    this.saving = true;
    const request$ =
      this.editingId === null
        ? this.carService.create(payload)
        : this.carService.update(this.editingId, payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.modalOpen = false;
        this.loadCars();
      },
      error: () => {
        this.saving = false;
        this.saveError = 'Salvarea a eșuat.';
      }
    });
  }
}
