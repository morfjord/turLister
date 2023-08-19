import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewImageComponent } from './view-image/view-image.component';


@NgModule({
  declarations: [ViewImageComponent],
  imports: [
    CommonModule
  ],
  exports: [ViewImageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
