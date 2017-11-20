import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { debounceTime, catchError, switchMap } from 'rxjs/operators';

import { SocketService } from './socket.service';
import { Company } from './company';

@Injectable()
export class CompanyService {
  private searchQuerySubject = new Subject<string>();
  private searchQuery = '';

  constructor(
    private http: HttpClient,
    private socketService: SocketService
  ) {
    this.socketService.getMessages()
                      .subscribe(() => {
                        this.searchQuerySubject.next(this.searchQuery);
                      });
  }

  private handleError<T>(operation: string, result?: T) {
    return (err: Error): Observable<T> => {
      console.log(`${operation} failed: ${err.toString()}`);
      return of(result as T);
    };
  }

  private searchCompanies(query: string): Observable<Company[]> {
    if (!query.trim()) return of([]);
    this.searchQuery = query.trim();
    const url: string = `/api/companies/search/?q=${query.trim()}`;
    return this.http.get<Company[]>(url)
                    .pipe(
                      catchError(this.handleError('Searching companies', []))
                    );
  }

  public pipeSearchQuery(): Observable<Company[]> {
    return this.searchQuerySubject.pipe(
      debounceTime(300),
      switchMap((query: string) => this.searchCompanies(query))
    );
  }

  public updateSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  public toggleCompany(company: Company): void {
    this.http.put<Company>(`/api/company/${company._id}/active`, company)
             .pipe(
                catchError(this.handleError('Toggling a company actice', company))
              )
              .subscribe();
  }
}
