import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import * as io from 'socket.io-client';

import { Company } from './company';

@Injectable()
export class SocketService {
  private socket = io(process.env.APP_URL);

  getMessages(): Observable<Company[]> {
    const observable = new Observable<Company[]>((observer: Observer<Company[]>) => {
      this.socket.on('company-toggled', (data: Company[]) => observer.next(data));
      return () => this.socket.disconnect();
    });
    return observable;
  }
}
