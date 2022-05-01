import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Roles } from '../shared/enums/roles';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
 
const RoleGuard = (role: Roles): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
 
      return user?.role.includes(role);
    }
  }
 
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;