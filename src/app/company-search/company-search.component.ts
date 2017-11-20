import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Company } from '../company';
import { CompanyService } from '../company.service';

import './company-search.component.scss';

@Component({
  selector: 'company-search',
  templateUrl: './company-search.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CompanySearchComponent implements OnInit {
  private searchQuery: string;
  private searchQuerySubject = new Subject<string>();
  companies$: Observable<Company[]>;

  constructor(
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.companies$ = this.searchQuerySubject.pipe(
      debounceTime(300),
      // distinctUntilChanged(),
      switchMap((query: string) => this.companyService.search(query))
    );
  }

  addCompany(company: Company): void {
    this.companyService.toggleCompany(company)
                       .subscribe(data => this.search(this.searchQuery));
  }

  search(query: string): void {
    this.searchQuery = query;
    this.searchQuerySubject.next(query);
  }
}
