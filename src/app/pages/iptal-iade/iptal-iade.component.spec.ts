import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IptalIadeComponent } from './iptal-iade.component';

describe('IptalIadeComponent', () => {
  let component: IptalIadeComponent;
  let fixture: ComponentFixture<IptalIadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IptalIadeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IptalIadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
