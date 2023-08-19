import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabInstagramPageRoutingModule } from './tab-instagram-routing.module';

import { TabInstagramPage } from './tab-instagram.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabInstagramPageRoutingModule
  ],
  declarations: [TabInstagramPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabInstagramPageModule {}
