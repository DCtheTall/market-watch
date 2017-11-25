import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Company } from '../company';
import { CompanyService } from '../company.service';

import './active-companies.component.scss';

@Component({
  selector: 'active-companies',
  templateUrl: './active-companies.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ActiveCompaniesComponent implements OnInit {
  private companies$: Observable<Company[]>;

  constructor(
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.companies$ = this.companyService.activeCompanies;
  }

  removeCompany(company: Company): void {
    this.companyService.toggleCompany(company);
  }
 }
