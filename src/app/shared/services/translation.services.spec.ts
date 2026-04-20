import { TestBed } from '@angular/core/testing';

import { TranslationServices } from './translation.services';

describe('TranslationServices', () => {
  let service: TranslationServices;

  /**
   * Configures TestBed and injects `TranslationServices` before each example.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationServices);
  });

  /**
   * Verifies the service is created.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
