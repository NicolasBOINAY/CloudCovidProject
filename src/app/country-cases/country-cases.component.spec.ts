import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryCasesComponent } from './country-cases.component';

describe('CountryCasesComponent', () => {
  let component: CountryCasesComponent;
  let fixture: ComponentFixture<CountryCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryCasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
