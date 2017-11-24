import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Company } from '../company';
import { CompanyService } from '../company.service';

import './company-search.component.scss';

@Component({
  selector: 'company-search',
  templateUrl: './company-search.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CompanySearchComponent implements OnInit {
  private companies$: Observable<Company[]>;

  constructor(
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.companies$ = this.companyService.pipeSearchQuery();
  }

  addCompany(company: Company): void {
    this.companyService.toggleCompany(company);
  }

  search(query: string): void {
    this.companyService.updateSearchQuery(query);
  }
}
