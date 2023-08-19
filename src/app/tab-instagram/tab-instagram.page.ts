import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewImageComponent } from '../components/view-image/view-image.component';
import { ApiService } from '../services/api.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import axios from 'axios';
import { myEnterAnimation, myLeaveAnimation } from '../services/nav-animation.service';

// const axios = require('axios');

@Component({
  selector: 'app-tab-instagram',
  templateUrl: './tab-instagram.page.html',
  styleUrls: ['./tab-instagram.page.scss'],
})
export class TabInstagramPage implements OnInit {
  instagram_images: any[] = [];
  instagram_ids: string[] = [];
  img: any;
  constructor(public modalController: ModalController, private apiService: ApiService, private iab: InAppBrowser) { }

  async ngOnInit() {
    this.instagram_ids = [];
    this.apiService.getPhotosWithHashtagFromInstagram().subscribe((res: any) => {
      console.log("instagram images:", res);
      res.forEach(media => {
        this.instagram_ids.push(media.media_id);
      });
      from(this.instagram_ids)
        .pipe(
          mergeMap(id => axios.get('https://api.instagram.com/oembed?url=https://www.instagram.com/p/' + id))
        )
        .subscribe((insta_img: any) => {
          this.instagram_images.push(insta_img.data.thumbnail_url)
        });
    }, e => {
      console.error("instagram images error:", JSON.stringify(e));

    })
  }

  async viewImage(url) {
    const modal = await this.modalController.create({
      component: ViewImageComponent,
      swipeToClose: true,
      componentProps: {
        'url': url
      },
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });
    return await modal.present();
  }

  showOnInstagram() {
    this.iab.create('https://www.instagram.com/explore/tags/turlister', '_system');
  }
}
