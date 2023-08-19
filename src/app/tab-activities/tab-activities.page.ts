import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab-activities',
  templateUrl: './tab-activities.page.html',
  styleUrls: ['./tab-activities.page.scss'],
})
export class TabActivitiesPage implements OnInit {

  categories: Observable<any>;
  constructor(private apiService: ApiService, public loadingController: LoadingController, private navCtrl: NavController) { }

  ngOnInit() {
    // has_in, id, name, pin_image, slug, url
    this.categories = this.apiService.getCategories();
    
  }

  filterToursWithCategory(category) {
    console.log("category:", category);
    this.apiService.onTourCategorySub.next(category.slug);
    this.navCtrl.navigateForward(['tabs/tab-map']);
  }
}
