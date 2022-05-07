import { SetMetadata } from '@nestjs/common';

// Using this decorator tells the global JwtAuthGuard to skip this guard.
const Public = () => SetMetadata('isPublic', true);
export default Public;