import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-map',
        loadChildren: () => import('../tab-map/tab-map.module').then(m => m.TabMapPageModule),
      },
      {
        path: 'tab-mytours',
        loadChildren: () => import('../tab-mytours/tab-mytours.module').then(m => m.TabMytoursPageModule)
      },
      {
        path: 'tab-instagram',
        loadChildren: () => import('../tab-instagram/tab-instagram.module').then(m => m.TabInstagramPageModule)
      },
      {
        path: 'tab-activities',
        loadChildren: () => import('../tab-activities/tab-activities.module').then(m => m.TabActivitiesPageModule)
      },
      {
        path: 'tab-about',
        loadChildren: () => import('../tab-about/tab-about.module').then(m => m.TabAboutPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab-map',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab-map',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
