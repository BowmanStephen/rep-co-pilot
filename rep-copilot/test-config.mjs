import { env } from './src/config/env.ts';

console.log('✅ Configuration validation passed!');
console.log('Environment:', env.NEXT_PUBLIC_APP_ENV);
console.log('API Base URL:', env.NEXT_PUBLIC_API_BASE_URL);
console.log('Coaching Default:', env.NEXT_PUBLIC_COACHING_MODE_DEFAULT);
console.log('Compliance Mode:', env.NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE);
