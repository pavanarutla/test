import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

declare var google:any;

export class Coordinates {
	lng: number;
	lat: number;
}

const COORDINATES: Coordinates[] = [
	{ lat: 17.4574279, lng: 78.3119675 },
	{ lat: 17.4474262, lng: 78.3319602 },
	{ lat: 17.4364212, lng: 78.3619627 },
	{ lat: 17.4444225, lng: 78.3219245 },
	{ lat: 17.4494139, lng: 78.3289475 },
	{ lat: 17.4414189, lng: 78.3299765 },
	{ lat: 17.4354819, lng: 78.3279135 }
];

@Injectable()
export class GmapService {

	map: any;

	constructor(private http: Http) {

	}

	createMap(el, center, zoom?):any{
		if(!zoom){
			zoom = 14
		}
		this.map = new google.maps.Map(el.nativeElement.querySelector('#gmap'), {
      center: center,
      zoom: zoom
    });
	}

	getMockCoords(): Observable<Coordinates[]> {
		return this.http.get(`http://localhost:8001/api/markers`).map((res: Response) => res.json());
	}
	getIntersections(): Promise<Coordinates[]> {
		var ptg = { lat: 17.4574279, lng: 78.3019645 };
		// code to get intersections from google maps api.
		// var service = new google.maps.places.PlacesService(map);
		// service.nearbySearch({
		//   location: ptg,
		//   radius: 500,
		//   type: ['store']
		// }, this.callback);
		return Promise.resolve(COORDINATES);
	}
	callback(results, status): void {//Coordinates[] {
		// var coordinates_arr = Coordinates[];
		// if (status === google.maps.places.PlacesServiceStatus.OK) {
		//     for (var i = 0; i < results.length; i++) {
		//         coordinates_arr.push(results[i]);
		//     }
		// }
		// return coordinates_arr;
		console.log(results);
	}
	putMarker(latLng, title?) {
		var marker = new google.maps.Marker({
			position: latLng,
			map: this.map,
			title: title
		});
	}
}