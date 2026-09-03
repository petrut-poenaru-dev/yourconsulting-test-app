import { Component, OnInit } from '@angular/core';

import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-persoane',
  templateUrl: './persoane.component.html',
  styleUrls: ['./persoane.component.scss']
})
export class PersoaneComponent implements OnInit {
  persons: Person[] = [];
  loading = false;
  error = '';

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadPersons();
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
}
