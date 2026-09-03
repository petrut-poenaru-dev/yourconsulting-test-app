import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Car, CarPayload } from '../models/car.model';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly baseUrl = `${environment.apiUrl}/cars`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Car[]> {
    return this.http.get<Car[]>(this.baseUrl);
  }

  find(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.baseUrl}/${id}`);
  }

  create(payload: CarPayload): Observable<Car> {
    return this.http.post<Car>(this.baseUrl, payload);
  }

  update(id: number, payload: CarPayload): Observable<Car> {
    return this.http.put<Car>(`${this.baseUrl}/${id}`, payload);
  }

  destroy(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
