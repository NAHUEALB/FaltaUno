import { TestBed } from '@angular/core/testing';

import { FirebaseauthService } from './firebaseauth.service';

describe('FirebaseauthService', () => {
  let service: FirebaseauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
