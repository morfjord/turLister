import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabActivitiesPageRoutingModule } from './tab-activities-routing.module';

import { TabActivitiesPage } from './tab-activities.page';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabActivitiesPageRoutingModule,
    PipesModule
  ],
  declarations: [TabActivitiesPage]
})
export class TabActivitiesPageModule { }
