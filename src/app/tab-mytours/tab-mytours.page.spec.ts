import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabMytoursPage } from './tab-mytours.page';

describe('TabMytoursPage', () => {
  let component: TabMytoursPage;
  let fixture: ComponentFixture<TabMytoursPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabMytoursPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabMytoursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
