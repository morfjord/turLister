import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabMapPage } from './tab-map.page';

const routes: Routes = [
  {
    path: '',
    component: TabMapPage,
  },
  {
    path: 'tour-detail',
    loadChildren: () => import('./tour-detail/tour-detail.module').then( m => m.TourDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabMapPageRoutingModule { }
