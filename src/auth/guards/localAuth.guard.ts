import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
 
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    // This can be used for debugging

    // handleRequest(err, user, info) {
    //     console.log({ err, user, info });
    //     return user
    //   }
}