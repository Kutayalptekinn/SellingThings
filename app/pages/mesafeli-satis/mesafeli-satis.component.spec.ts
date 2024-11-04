import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesafeliSatisComponent } from './mesafeli-satis.component';

describe('MesafeliSatisComponent', () => {
  let component: MesafeliSatisComponent;
  let fixture: ComponentFixture<MesafeliSatisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesafeliSatisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MesafeliSatisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
