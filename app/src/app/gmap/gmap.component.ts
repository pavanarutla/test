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
  el:ElementRef;
  constructor(private elem:ElementRef){
    this.el = elem;
  }
  ngOnInit() : void{
    console.log(this.el.nativeElement.querySelector('#gmap'));
    var map = new google.maps.Map(this.el.nativeElement.querySelector('#gmap'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  }
}