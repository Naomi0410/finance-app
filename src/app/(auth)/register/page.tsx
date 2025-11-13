'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form } from '@/components/ui/Form';
import { SubmitButton } from '@/components/ui/SubmitButton';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <section>
      <h1 className="text-preset-1 text-grey-900 pb-400">Sign Up</h1>

      <Form
        showNameField
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          const res = await fetch('/api/register', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            router.push('/login/?signUpSuccess=1');
          } else {
            router.push('/register/?signUpError=1');
          }
        }}
      >
        <SubmitButton>Sign Up</SubmitButton>
      </Form>

      <p className="text-sm text-center mt-400 text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-gray-800 underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}
