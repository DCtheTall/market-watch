import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CompanySearchComponent } from './company-search/company-search.component';
import { ActiveCompaniesComponent } from './active-companies/active-companies.component';
import { ChartComponent } from './chart/chart.component';

import { SocketService } from './socket.service';
import { CompanyService } from './company.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    CompanySearchComponent,
    ActiveCompaniesComponent,
    ChartComponent,
  ],
  providers: [
    SocketService,
    CompanyService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
