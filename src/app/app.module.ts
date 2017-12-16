import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CompanySearchComponent } from './company-search/company-search.component';
import { ActiveCompaniesComponent } from './active-companies/active-companies.component';
import { ChartComponent } from './chart/chart.component';
import { ErrorBarComponent } from './error-bar/error-bar.component';

import { SocketService } from './socket.service';
import { ChartService } from './chart.service';
import { CompanyService } from './company.service';
import { ErrorService } from './error.service';

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
    ErrorBarComponent,
  ],
  providers: [
    SocketService,
    ChartService,
    ErrorService,
    CompanyService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
