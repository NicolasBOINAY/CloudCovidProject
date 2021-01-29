import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldwideCasesComponent } from './worldwide-cases.component';

describe('WorldwideCasesComponent', () => {
  let component: WorldwideCasesComponent;
  let fixture: ComponentFixture<WorldwideCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldwideCasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldwideCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
