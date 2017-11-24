import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  private socket = io(process.env.APP_URL);

  getMessages(): Observable<string> {
    const observable = new Observable<string>((observer: Observer<string>) => {
      this.socket.on('company-toggled', (message: string) => {
        console.log(message);
        observer.next(message);
      });
      return () => this.socket.disconnect();
    });
    return observable;
  }
}
