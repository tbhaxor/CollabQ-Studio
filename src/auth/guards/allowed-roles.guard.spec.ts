import { AllowedRolesGuard } from './allowed-roles.guard';

describe('AllowedRolesGuard', () => {
  it('should be defined', () => {
    expect(new AllowedRolesGuard()).toBeDefined();
  });
});
