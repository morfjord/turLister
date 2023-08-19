import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterIconsPipe } from './filter-icons.pipe';



@NgModule({
  declarations: [FilterIconsPipe],
  imports: [
    CommonModule
  ],
  exports: [
    FilterIconsPipe
  ]
})
export class PipesModule { }
