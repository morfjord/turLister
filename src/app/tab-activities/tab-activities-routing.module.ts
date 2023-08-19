import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabActivitiesPage } from './tab-activities.page';

const routes: Routes = [
  {
    path: '',
    component: TabActivitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabActivitiesPageRoutingModule {}
