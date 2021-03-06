import { Component, OnInit } from '@angular/core';

import { MAXIMUM_ALLOWED_ACTIVE_COMPANIES } from './constants';

import { CompanyService } from './company.service';
import { ErrorService } from './error.service';

import './app.component.scss';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private MAXIMUM_ALLOWED_ACTIVE_COMPANIES = MAXIMUM_ALLOWED_ACTIVE_COMPANIES;

  constructor(
    private errorService: ErrorService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {}
}
