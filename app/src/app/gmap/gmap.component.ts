import { Component, ElementRef, EventEmitter, Output } from '@angular/core';

import {GmapService} from './gmap.service';
declare var google: any;

@Component({
  selector: 'gmap',
  template: '<div id="gmap"></div>',
  styles:[
    '#gmap{width:100%;height:400px;}'
  ]
})

export class GmapComponent{
  lat: number;
  lng: number;
  el:ElementRef;
  @Output() onMapInit = new EventEmitter<boolean>();
  constructor(private elem:ElementRef, private gmapSrvc:GmapService){
    this.el = elem;
    var nativeEl= elem.nativeElement;
    if(nativeEl.getAttribute('lat') === null || nativeEl.getAttribute('lat') === null){
      this.lat = 17.4574;
      this.lng = 78.3720;
    }
    else{
      this.lat = nativeEl.getAttribute('lat');
      this.lng = nativeEl.getAttribute('lng');
    }

    // this.gmapSrvc.getMockCoords().subscribe(data => {
    //   console.log(data);
    // });
  }
  ngOnInit() : void{
    console.log("in gmap component");
    let center = {lat: Number(this.lat), lng: Number(this.lng)};
    this.gmapSrvc.createMap(this.el, center);
    // 
  }
  ngAfterViewInit(): void{
    this.onMapInit.emit(true);
  }
}