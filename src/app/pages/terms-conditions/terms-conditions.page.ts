import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.page.html',
  styleUrls: ['./terms-conditions.page.scss'],
})
export class TermsConditionsPage implements OnInit {
  content: any;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getTermsConditions().subscribe((res: any) => {
      console.log("res: terms:", res);
      this.content = res.content;
    }, error => {
      console.log("error get terms:", JSON.stringify(error));
    })
  }

}
