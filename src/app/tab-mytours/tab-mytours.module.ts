import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabMytoursPageRoutingModule } from './tab-mytours-routing.module';

import { TabMytoursPage } from './tab-mytours.page';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabMytoursPageRoutingModule,
    NgPipesModule
  ],
  declarations: [TabMytoursPage]
})
export class TabMytoursPageModule {}
