import type { Payload } from 'payload';
import type { User } from '../payload-types';

/**
 * Helper function to create the admin user with correct roles
 */
async function createAdmin(payload: Payload, tenantId: string): Promise<User> {
  return await payload.create({
    collection: 'users',
    data: {
      name: 'Josiane Gauthier',
      email: 'admin@jgperformancehorses.com',
      password: 'securePassword123',
      roles: ['user'], // Changed from 'tenant-admin' to 'user'
      tenants: [
        {
          tenant: tenantId,
          roles: ['tenant-admin'], // This is correct for tenant-specific roles
        },
      ],
    } as any
  });
}

export default createAdmin;
