import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Person, PersonPayload } from '../../models/person.model';
import { Car } from '../../models/car.model';
import { PersonService } from '../../services/person.service';
import { CarService } from '../../services/car.service';

const FIELD_LABELS: Record<string, string> = {
  nume: 'Nume',
  prenume: 'Prenume',
  cnp: 'CNP'
};

function ageFromCnp(cnp: string): number | null {
  if (!/^\d{13}$/.test(cnp)) {
    return null;
  }

  const s = Number(cnp[0]);
  const yy = Number(cnp.substring(1, 3));
  const mm = Number(cnp.substring(3, 5));
  const dd = Number(cnp.substring(5, 7));

  let century: number;
  if (s === 1 || s === 2) {
    century = 1900;
  } else if (s === 3 || s === 4) {
    century = 1800;
  } else if (s === 5 || s === 6) {
    century = 2000;
  } else {
    century = yy + 2000 <= new Date().getFullYear() ? 2000 : 1900;
  }

  const year = century + yy;
  const birth = new Date(year, mm - 1, dd);

  if (birth.getFullYear() !== year || birth.getMonth() !== mm - 1 || birth.getDate() !== dd) {
    return null;
  }

  const now = new Date();
  let age = now.getFullYear() - year;
  const monthDiff = now.getMonth() - (mm - 1);
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dd)) {
    age--;
  }

  return age >= 0 && age < 150 ? age : null;
}

@Component({
  selector: 'app-persoane',
  templateUrl: './persoane.component.html',
  styleUrls: ['./persoane.component.scss']
})
export class PersoaneComponent implements OnInit {
  persons: Person[] = [];
  cars: Car[] = [];
  loading = false;
  error = '';

  modalOpen = false;
  editingId: number | null = null;
  submitted = false;
  saving = false;
  saveError = '';

  form: FormGroup = this.fb.group({
    nume: ['', [Validators.required, Validators.maxLength(255)]],
    prenume: ['', [Validators.required, Validators.maxLength(255)]],
    cnp: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    cars: [[] as number[]]
  });

  constructor(
    private personService: PersonService,
    private carService: CarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadPersons();
    this.loadCars();
  }

  loadPersons(): void {
    this.loading = true;
    this.error = '';
    this.personService.findAll().subscribe({
      next: (persons) => {
        this.persons = persons;
        this.loading = false;
      },
      error: () => {
        this.error = 'Nu s-au putut încărca persoanele.';
        this.loading = false;
      }
    });
  }

  loadCars(): void {
    this.carService.findAll().subscribe({
      next: (cars) => (this.cars = cars)
    });
  }

  get varsta(): number | null {
    return ageFromCnp(String(this.form.get('cnp')?.value ?? ''));
  }

  get validationErrors(): string[] {
    const messages: string[] = [];

    Object.keys(FIELD_LABELS).forEach((key) => {
      if (this.form.get(key)?.hasError('required')) {
        messages.push(`Câmpul "${FIELD_LABELS[key]}" este obligatoriu.`);
      }
    });

    if (this.form.get('cnp')?.hasError('pattern')) {
      messages.push('Câmpul "CNP" trebuie să conțină 13 cifre.');
    }

    if (!this.form.get('cnp')?.invalid && this.varsta === null) {
      messages.push('Câmpul "Vârsta" nu a putut fi calculat din CNP.');
    }

    return messages;
  }

  openCreate(): void {
    this.editingId = null;
    this.submitted = false;
    this.saveError = '';
    this.form.reset({ nume: '', prenume: '', cnp: '', cars: [] });
    this.modalOpen = true;
  }

  openEdit(person: Person): void {
    this.editingId = person.id;
    this.submitted = false;
    this.saveError = '';
    this.form.setValue({
      nume: person.nume,
      prenume: person.prenume,
      cnp: person.cnp,
      cars: person.cars.map((car) => car.id)
    });
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  submit(): void {
    this.submitted = true;
    this.saveError = '';

    if (this.form.invalid || this.varsta === null) {
      return;
    }

    const payload: PersonPayload = {
      nume: this.form.value.nume,
      prenume: this.form.value.prenume,
      cnp: this.form.value.cnp,
      varsta: this.varsta,
      cars: this.form.value.cars ?? []
    };

    this.saving = true;
    const request$ =
      this.editingId === null
        ? this.personService.create(payload)
        : this.personService.update(this.editingId, payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.modalOpen = false;
        this.loadPersons();
      },
      error: () => {
        this.saving = false;
        this.saveError = 'Salvarea a eșuat.';
      }
    });
  }
}
