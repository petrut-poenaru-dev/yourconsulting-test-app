import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Person, PersonPayload } from '../models/person.model';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private readonly baseUrl = `${environment.apiUrl}/persons`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseUrl);
  }

  find(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseUrl}/${id}`);
  }

  create(payload: PersonPayload): Observable<Person> {
    return this.http.post<Person>(this.baseUrl, payload);
  }

  update(id: number, payload: PersonPayload): Observable<Person> {
    return this.http.put<Person>(`${this.baseUrl}/${id}`, payload);
  }

  destroy(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  removeCar(personId: number, carId: number): Observable<Person> {
    return this.http.delete<Person>(`${this.baseUrl}/${personId}/cars/${carId}`);
  }
}
