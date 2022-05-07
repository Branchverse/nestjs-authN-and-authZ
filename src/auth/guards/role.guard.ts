import { Role } from '../../shared/enums/role';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import JwtAuthGuard from './jwtAuth.guard';

const RoleGuard = (role: Role): Type<CanActivate> => {
    class RoleGuardMixin extends JwtAuthGuard {
        async canActivate(context: ExecutionContext) {
            await super.canActivate(context);

            const request = context.switchToHttp().getRequest<RequestWithUser>();
            const user = request.user;

            return user?.role.includes(role);
        }
    }

    return mixin(RoleGuardMixin);
}

export default RoleGuard;
