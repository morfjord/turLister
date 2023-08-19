import { Component } from '@angular/core';
import { Animation, AnimationController } from '@ionic/angular';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private animationCtrl: AnimationController) {
    // const animation: Animation = this.animationCtrl.create()
    //   .addElement(myElementRef)
    //   .duration(1000)
    //   .fromTo('opacity', '1', '0.5');
  }
}
