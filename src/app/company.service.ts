import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { debounceTime, catchError, switchMap, map } from 'rxjs/operators';

import * as d3 from 'd3';

import {
  MAXIMUM_ALLOWED_ACTIVE_COMPANIES,
} from './constants';

import { SocketService } from './socket.service';
import { ChartService } from './chart.service';

import { Company } from './company';

@Injectable()
export class CompanyService {
  private activeCompanyObserver: Observer<Company[]>;
  private searchQuerySubject = new Subject<string>();
  private searchQuery = '';
  private searchedCompaniesObserver: Observer<Company[]>;

  public activeCompanies: Observable<Company[]>;
  public numberOfActiveCompanies = 0;
  public searchedCompanies: Observable<Company[]>;

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private chartService: ChartService
  ) {
    this.activeCompanies = Observable.create((observer: Observer<Company[]>) => {
      this.activeCompanyObserver = observer;
      this.getActiveCompanies();
    });
    this.activeCompanies.subscribe();

    this.searchedCompanies = Observable.create((observer: Observer<Company[]>) => {
      this.searchedCompaniesObserver = observer;
    });
    this.searchedCompanies.subscribe(() => {
      this.chartService.updateChart();
    });

    this.searchQuerySubject.subscribe((query: string) => {
      this.searchCompanies(query);
    });

    this.socketService.getMessages()
                      .subscribe(this.receiveSocketMessage.bind(this));
  }

  private handleError<T>(operation: string, result?: T) {
    return (err: Error): Observable<T> => {
      console.log(`${operation} failed: ${err.toString()}`);
      return of(result as T);
    };
  }

  public getActiveCompanies(): void {
    this.http.get<Company[]>(`/api/companies/active`)
            .pipe(
              catchError(this.handleError('Getting active companies', []))
            )
            .subscribe((data: Company[]) => {
              const getCompanyColor = <d3.ScaleLinear<number, number>>(
                d3.scaleLinear()
                  .domain([0, data.length - 1])
                  .range([0, 240])
              );
              const companies = data.map((company: Company, i: number) => {
                const color = `hsl(${getCompanyColor(i)}, 80%, 65%)`
                return { ...company, color };
              });
              this.numberOfActiveCompanies = data.length;
              if (data.length === MAXIMUM_ALLOWED_ACTIVE_COMPANIES) {
                this.searchQuery = '';
                this.searchQuerySubject.next('');
              }
              this.activeCompanyObserver.next(companies);
              this.chartService.companiesObserver.next(companies);
            });
  }

  private receiveSocketMessage(): void {
    this.getActiveCompanies();
    this.searchQuerySubject.next(this.searchQuery);
  }

  private searchCompanies(_query: string): void {
    const query = _query.trim();
    if (!query) {
      this.searchedCompaniesObserver.next([]);
      return;
    }
    this.searchQuery = query;
    const url: string = `/api/companies/search/?q=${query.trim()}`;
    this.http.get<Company[]>(url)
             .pipe(
               catchError(this.handleError('Searching companies', []))
             )
             .subscribe((data: Company[]) => {
               this.searchedCompaniesObserver.next(data);
             });
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
