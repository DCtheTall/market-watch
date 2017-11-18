import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CompanySearchComponent } from './company-search/company-search.component';

import { CompanyService } from './company.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    CompanySearchComponent,
  ],
  providers: [CompanyService],
  bootstrap: [AppComponent],
})
export class AppModule {}
