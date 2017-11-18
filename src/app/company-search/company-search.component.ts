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
  private searchQuery = new Subject<string>();
  companies$: Observable<Company[]>;

  constructor(
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.companies$ = this.searchQuery.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string) => this.companyService.search(query))
    );
  }

  search(query: string): void {
    this.searchQuery.next(query);
  }
}
