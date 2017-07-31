import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GmapComponent } from './gmap/gmap.component';
import { GmapService } from './gmap/gmap.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule
  ],
  providers: [GmapService],
  declarations: [ AppComponent, GmapComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}