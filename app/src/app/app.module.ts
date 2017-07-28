import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GmapComponent } from './gmap/gmap.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  declarations: [ AppComponent, GmapComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}