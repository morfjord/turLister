import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

declare var google: any;
@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.page.html',
  styleUrls: ['./tour-detail.page.scss'],
})
export class TourDetailPage implements OnInit {
  tourid: any;
  tourInfo: any;
  user = this.apiService.getUser();
  email: any;
  // currentUser: any;
  currentLocation: any;
  constructor(
    private activatedRoute: ActivatedRoute, private apiService: ApiService, private toastCtrl: ToastController,
    private storage: Storage, private navCtrl: NavController
  ) {
    // this.user.subscribe(res => {
    //   console.log("res:", res.email);
    //   this.email = res.email;
    // });
    // this.currentUser = this.apiService.getUserValue();
    this.activatedRoute.queryParams.subscribe(res => {
      this.tourid = res.tourid;
      let user = this.apiService.getUserValue();
      this.email = ''
      if (user) {
        this.email = user.email;
      }
      this.getTourInfo(this.tourid, this.email);
    });
  }

  async ngOnInit() {
    this.currentLocation = await this.storage.get(this.apiService.CUR_LOCATION);
  }
  getTourInfo(tourid, email) {
    this.apiService.getTourDetail(tourid, email).subscribe(res => {
      this.tourInfo = res;
      console.log("tour info:", this.tourInfo);
    })
  }
  async registerTour() {
    if (!this.email) {
      const toast = await this.toastCtrl.create({
        message: 'Klikk her for å logge inn.',
        duration: 3000,
        buttons: [
          {
            text: 'Logg inn',
            handler: () => {
              console.log('Cancel clicked');
              this.navCtrl.navigateRoot(['login']);
            }
          }
        ]
      });
      toast.present();
      return;
    }
    if (!this.tourInfo ?.id) return;

    // caculate distance between current location and specific one.
    if (!this.currentLocation) { return; }
    let distance = this.apiService.getDistanceBetweenPoints(this.currentLocation.lat, this.currentLocation.lng, this.tourInfo.coords.lat, this.tourInfo.coords.lon);
    if (distance > 100) {
      const toast = await this.toastCtrl.create({
        message: 'Det ser ut til at du er for langt fra tur-aktivitet.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }
    this.apiService.checkinTour(this.tourInfo.id, this.email).subscribe(async (res: any) => {
      console.log("checkin result:", res);
      if (res.result === true) {
        const toast = await this.toastCtrl.create({
          message: res.info,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.getTourInfo(this.tourInfo.id, this.email);
      } else {
        const toast = await this.toastCtrl.create({
          message: res.info,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    }, err => {
      console.error("error checkin result:", JSON.stringify(err));
    })
  }
}
