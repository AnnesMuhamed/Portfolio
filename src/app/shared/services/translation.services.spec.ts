import { TestBed } from '@angular/core/testing';

import { TranslationServices } from './translation.services';

describe('TranslationServices', () => {
  let service: TranslationServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
