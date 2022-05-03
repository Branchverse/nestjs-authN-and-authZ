import { SetMetadata } from '@nestjs/common';

// Using this decorator tells the global JwtAuthGuard to skip this guard.
export const Public = () => SetMetadata('isPublic', true);