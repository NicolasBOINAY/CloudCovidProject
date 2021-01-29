import { TestBed } from '@angular/core/testing';

import { CovidinfosService } from './covidinfos.service';

describe('CovidinfosService', () => {
  let service: CovidinfosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidinfosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
