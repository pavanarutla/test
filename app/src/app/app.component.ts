import { Component, OnInit } from '@angular/core';
import { MapService } from './map.service';
import { Coordinates } from './map.service';
declare var google: any;

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [MapService]
})

export class AppComponent implements OnInit{
  title: string = 'BillBoards India';
  lat: number = 17.4574279;
  lng: number = 78.3019645;
  zoom: number = 12;
  coordinates: Coordinates[];
  
  constructor(private mapService: MapService) {
    //this.mapService.getMockCoords().then(coordinates => this.coordinates = coordinates);
    // var showIntersections:any = function(){
    //   return gmApiWrap.getNativeMap().then(function(map){
    //     var ptg = {lat: 17.4574279,  lng: 78.3019645};
    //     // code to get intersections from google maps api.
    //     var service = new google.maps.places.PlacesService(map);
    //     service.nearbySearch({
    //       location: ptg,
    //       radius: 500,
    //       type: ['intersections']
    //     },
    //     function(results, status){
    //       return results;
    //     });
    //   });
    // }
    // showIntersections().then(function(result){
    //   console.log(result);
    // });
    // var map;
    // function initMap() {  
      
    // }
    // var service = new google.maps.places.PlacesService(map);
    // var ptg = {lat: 17.4574279,  lng: 78.3019645};
    // service.nearbySearch({
    //   location: ptg,
    //   radius: 500,
    //   type: ['intersections']
    // },
    // function(results, status){
    //   return results;
    // });
  }

  ngOnInit(): void {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  }
}