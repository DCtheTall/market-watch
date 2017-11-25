import { Component } from '@angular/core';

import { MAXIMUM_ALLOWED_ACTIVE_COMPANIES } from './constants';
import { CompanyService } from './company.service';

import './app.component.scss';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  private MAXIMUM_ALLOWED_ACTIVE_COMPANIES = MAXIMUM_ALLOWED_ACTIVE_COMPANIES;

  constructor(
    private companyService: CompanyService
  ) {}
}
