import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabAboutPage } from './tab-about.page';

describe('TabAboutPage', () => {
  let component: TabAboutPage;
  let fixture: ComponentFixture<TabAboutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabAboutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabAboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
