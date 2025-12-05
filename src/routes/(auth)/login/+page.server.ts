import type { Actions } from './$types';

export const actions: Actions = {
  login: async ({ request }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '').trim();
    const role = String(form.get('role') ?? '').trim();

    if (!email || !password || !role) {
      return { success: false, error: 'Email, password, and role are required.' };
    }

    const credentials = {
      admin: { email: 'admin@artventory.com', password: 'admin123' },
      cashier: { email: 'cashier@artventory.com', password: 'cashier123' }
    } as const;

    const match = credentials[role as 'admin' | 'cashier'];

    if (match && email === match.email && password === match.password) {
      return { success: true, role };
    }

    return { success: false, error: 'Invalid credentials.' };
  }
};
