'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AuthToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let updated = false;

    if (params.get('loginSuccess') === '1') {
      toast.success('Successfully logged in');
      params.delete('loginSuccess');
      updated = true;
    }

    if (params.get('loginError') === '1') {
      toast.error('Login failed');
      params.delete('loginError');
      updated = true;
    }

    if (params.get('signUpSuccess') === '1') {
      toast.success('Account created successfully');
      params.delete('signUpSuccess');
      updated = true;
    }

    if (params.get('signUpError') === '1') {
      toast.error('User already exists');
      params.delete('signUpError');
      updated = true;
    }

    if (updated) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return null;
}