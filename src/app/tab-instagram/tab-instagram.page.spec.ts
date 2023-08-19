import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabInstagramPage } from './tab-instagram.page';

describe('TabInstagramPage', () => {
  let component: TabInstagramPage;
  let fixture: ComponentFixture<TabInstagramPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabInstagramPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabInstagramPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
