import { Injectable } from '@angular/core';

import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ErrorService {
  private errorObserver: Observer<string>;

  public error: string;

  constructor() {
    Observable.create((observer: Observer<string>) => {
      this.errorObserver = observer;
    })
    .subscribe((message: string) => {
      this.error = message;
    });
  }

  public addError(message: string) {
    this.errorObserver.next(message);
  }

  public clearError(): void {
    this.errorObserver.next('');
  }
}
