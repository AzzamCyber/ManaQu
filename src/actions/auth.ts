'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (email === 'admin@azzam.com' && password === 'azzam108') {
    const cookieStore = await cookies();
    cookieStore.set('manaqu_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Email atau password salah!' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('manaqu_session');
  redirect('/');
}
