import { Component, ElementRef, OnInit } from '@angular/core';

import {GMapService} from './gmap.service';
declare var google: any;

@Component({
  selector: 'gmap',
  template: '<div id="gmap"></div>',
  styles:[
    '#gmap{width:100%;height:400px;}'
  ]
})

export class GmapComponent implements OnInit{
  lat: number;
  lng: number;
  el:ElementRef;
  constructor(private elem:ElementRef){
    this.el = elem;
    var nativeEl= elem.nativeElement;
    if(nativeEl.getAttribute('lat') === undefined || nativeEl.getAttribute('lat') === undefined){
      this.lat = 17.4574;
      this.lng = 78.3720;
    }
    else{
      this.lat = nativeEl.getAttribute('lat');
      this.lng = nativeEl.getAttribute('lng');
    }
  }
  ngOnInit() : void{
    console.log(this.lat, this.lng);
    var map = new google.maps.Map(this.el.nativeElement.querySelector('#gmap'), {
      center: {lat: this.lat, lng: this.lng},
      zoom: 8
    });
  }
}