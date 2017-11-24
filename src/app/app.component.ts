import { Component } from '@angular/core';

import { CompanyService } from './company.service';

import './app.component.scss';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private companyService: CompanyService
  ) {}
}
