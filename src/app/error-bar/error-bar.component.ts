import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ErrorService } from '../error.service';

import './error-bar.component.scss';

@Component({
  selector: 'error-bar',
  templateUrl: './error-bar.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ErrorBarComponent {
  constructor(
    private errorService: ErrorService
  ) {}

  private clearError(): void {
    this.errorService.clearError();
  }
}
