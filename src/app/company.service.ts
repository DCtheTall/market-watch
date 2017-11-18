import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { Company } from './company';

@Injectable()
export class CompanyService {
  private SEARCH_COMPANIES_URL = '/api/companies/search';

  constructor(
    private http: HttpClient
  ) {}

  handleError<T>(operation: string, result?: T) {
    return (err: Error): Observable<T> => {
      console.log(`${operation} failed: ${err.toString()}`);
      return of(result as T);
    };
  }

  public search(query: string): Observable<Company[]> {
    if (!query.trim()) return of([]);
    const url: string = `${this.SEARCH_COMPANIES_URL}/?q=${query.trim()}`;
    return this.http.get<Company[]>(url)
                    .do(data => console.log(data))
                    .pipe(
                      catchError(this.handleError('Searching companies', []))
                    );
  }
}
