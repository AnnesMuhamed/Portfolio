import { TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let service: HeaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
