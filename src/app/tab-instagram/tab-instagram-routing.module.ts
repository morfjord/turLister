import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabInstagramPage } from './tab-instagram.page';

const routes: Routes = [
  {
    path: '',
    component: TabInstagramPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabInstagramPageRoutingModule {}
