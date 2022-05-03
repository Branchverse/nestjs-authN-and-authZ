import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    // This can be used for debugging

    // This guard lets the user through but if he is logged in the user data is appended.
    handleRequest(err, user, info) {
        return user? user : null;
    }
}