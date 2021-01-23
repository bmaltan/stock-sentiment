import { TestBed } from '@angular/core/testing';

import { DevicePlatformService } from './device-platform.service';

describe('DevicePlatformService', () => {
  let service: DevicePlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicePlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
