import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NavController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { MarkerWithLabel } from 'markerwithlabel';
import { ShortenPipe } from 'ngx-pipes';
import { Storage } from '@ionic/storage';
declare var require: any

var MarkerWithLabel = require('markerwithlabel')(google.maps);

declare var google: any;

@Component({
  selector: 'app-tab-map',
  templateUrl: './tab-map.page.html',
  styleUrls: ['./tab-map.page.scss'],
  providers: [ShortenPipe]
})
export class TabMapPage implements OnInit, OnDestroy {
  map: any;
  tourlist = [];
  markers: any[] = [];
  tour_category: string = '';
  searchStr: string = '';
  isSearch = false;
  mylocation: any;
  myMarker: any;
  myCityCircle: any;
  isSetCenter: boolean = false;

  // google map
  @ViewChild('mapElement', { static: true }) mapElement;
  curWindow: any;

  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private apiService: ApiService, private geolocation: Geolocation, private navCtrl: NavController,
    private shortenPipe: ShortenPipe, private storage: Storage, private platform: Platform, private toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe(res => {
        // console.log("current location:", res);
        this.mylocation = res.coords;
        // add my marker with current location.
        const pos = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        };
        // alert("pos:" + JSON.stringify(pos));
        this.storage.set(this.apiService.CUR_LOCATION, pos);
        if (!this.isSetCenter) {
          this.map.setZoom(12);
          this.map.setCenter(pos);
          this.isSetCenter = !this.isSetCenter;
        }
        this.moveMyLocation(pos);
      }, error => {
        console.log("error current location:", error);
        // alert("error location:" + JSON.stringify(error));
        this.storage.set(this.apiService.CUR_LOCATION, null);
      });
    });

    this.apiService.onTourCategorySub
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        this.tour_category = res;
        this.searchStr = '';
        this.isSearch = false;
        // remove previous markers
        this.deleteMarkers();
        // load filtered markers
        this.addMarkers();
      });
  }

  ngOnInit() {
    this.loadMap();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  changeTourCategory(e) {
    this.searchStr = e.target.value;
    this.isSearch = true;
    // remove previous markers
    this.deleteMarkers();
    // load filtered markers
    this.addMarkers();
  }

  showAll() {
    this.apiService.onTourCategorySub.next('');
  }
  loadMap() {
    let latLng = new google.maps.LatLng(58.374053, 7.285105);
    let mapOptions = {
      center: latLng,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false,
      maxZoom: 15,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      minZoom: 3,
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
  addMarkers() {
    this.apiService.getTours(this.tour_category, this.searchStr, this.isSearch).subscribe((res: any[]) => {
      this.tourlist = res;
      console.log("this.tourlist:", this.tourlist);

      this.tourlist.forEach((tour: any) => {
        const pos = {
          lat: parseFloat(tour.coords.lat),
          lng: parseFloat(tour.coords.lon)
        };
        const marker = new google.maps.Marker({
          map: this.map,
          position: pos,
          icon: {
            url: 'assets/icon/marker_icons/' + tour.marker + '.png',
            scaledSize: new google.maps.Size(32, 38)
          }
        });

        // const marker = new MarkerWithLabel({
        //   position: pos,
        //   icon: ' ',
        //   map: this.map,
        //   animation: google.maps.Animation.DROP,
        //   labelContent: tour.marker,
        //   labelAnchor: new google.maps.Point(22, 0),
        //   labelClass: "custom-marker-class" // the CSS class for the label
        // });
        this.markers.push(marker);
        // create popup
        let popupContent = `
          <div class="popup-content-container">
            <div class="popup-content-img" style="background-image: url(` + tour.featured_img + `); background-size: cover;">            
            </div>
            <div class="popup-content-desc">
              <h3>` + tour.title + `</h3>
              <h6>` + this.shortenPipe.transform(tour.description, 35, '...') + `</h6>
              <ion-button expand="full" class="view-tour-btn ion-no-margin">
                Les mer
                <ion-icon slot="end" name="open-outline"></ion-icon>
              </ion-button>
            </div>
          </div>
        `;
        const infoWindow = new google.maps.InfoWindow({
          content: popupContent,
          maxWidth: 250,
        });

        // Event
        let variable = this;
        marker.addListener('click', function () {
          if (variable.curWindow) {
            variable.curWindow.close();
          }
          variable.curWindow = infoWindow;
          infoWindow.open(this.map, marker);
        });

        this.map.addListener('click', function () {
          infoWindow.close();
        });

        google.maps.event.addListener(infoWindow, 'domready', () => {
          const el = document.querySelector('.view-tour-btn');
          el.addEventListener('click', (e) => {
            variable.navCtrl.navigateForward(['tabs/tab-map/tour-detail'], { queryParams: { tourid: tour.id } });
          });
        });

      });
    }, e => {
    });
  }

  async moveMyLocation(pos) {
    // remove originall marker
    if (this.myMarker) {
      this.myMarker.setMap(null);
    }
    this.myMarker = new google.maps.Marker({
      map: this.map,
      position: pos
    });
    // this.markers.push(this.myMarker);
    const infoWindow = new google.maps.InfoWindow({
      content: 'You are within 100 meters from this point',
      maxWidth: 250,
    });

    let variable = this;
    this.myMarker.addListener('click', function () {
      if (variable.curWindow) {
        variable.curWindow.close();
      }
      variable.curWindow = infoWindow;
      infoWindow.open(this.map, this.myMarker);
    });
    this.map.addListener('click', function () {
      infoWindow.close();
    });
  }

  /**
   * 
   * @param pos draw blue circle around me
   */
  async drawCircle(pos) {
    if (this.myCityCircle) {
      this.myCityCircle.setMap(null);
    }
    this.myCityCircle = new google.maps.Circle({
      strokeColor: '#007bff',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#007bff',
      fillOpacity: 0.35,
      map: this.map,
      center: pos,
      radius: 35380.75
    });
  }

  doCloseBy() {
    this.geolocation.getCurrentPosition().then(res => {
      this.mylocation = res.coords;
      // add my marker with current location.
      const pos = {
        lat: res.coords.latitude,
        lng: res.coords.longitude
      };

      this.map.setZoom(12);
      this.map.setCenter(pos);
      // this.isSetCenter = !this.isSetCenter;
      this.moveMyLocation(pos);
      // this.drawCircle(pos);
    }).catch(error => {
      console.log("error current location:", error);
    })
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
  }
}