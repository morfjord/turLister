import { TestBed } from '@angular/core/testing';

import { HttpconfigInterceptorService } from './httpconfig-interceptor.service';

describe('HttpconfigInterceptorService', () => {
  let service: HttpconfigInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpconfigInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
