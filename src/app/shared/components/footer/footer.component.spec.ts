import { TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let service: FooterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FooterComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
