import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab-about',
  templateUrl: './tab-about.page.html',
  styleUrls: ['./tab-about.page.scss'],
})
export class TabAboutPage implements OnInit {
  about: any;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getAbout().subscribe(res => {
      this.about = res;
      console.log("res:", this.about);
      
    });
  }

}
