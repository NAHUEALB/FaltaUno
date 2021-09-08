import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AyudaMenuLateralPage } from './ayuda-menu-lateral.page';

describe('AyudaMenuLateralPage', () => {
  let component: AyudaMenuLateralPage;
  let fixture: ComponentFixture<AyudaMenuLateralPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AyudaMenuLateralPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AyudaMenuLateralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
