import { Component } from '@angular/core';

import { GmapService } from './gmap/gmap.service';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent{
  constructor(private gmapSrvc:GmapService){
    
  }
  mapInitialized(){
    // let latLng = {lat:Number(17.457491), lng:Number(78.373358)};
    // this.gmapSrvc.putMarker(latLng);
    let coordinates = this.gmapSrvc.getMockCoords();
    console.log(coordinates);
    this.gmapSrvc.createMarkerCluster(coordinates);
  }
}