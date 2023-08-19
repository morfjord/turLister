import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabMytoursPage } from './tab-mytours.page';

const routes: Routes = [
  {
    path: '',
    component: TabMytoursPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabMytoursPageRoutingModule {}
