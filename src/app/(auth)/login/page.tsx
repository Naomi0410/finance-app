"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Form } from "@/components/ui/Form";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { GoogleLoginButton } from "@/components/ui/GoogleLoginButton";
import { GuestLoginButton } from "@/components/ui/GuestLoginButton";

export default function LoginPage() {
  const router = useRouter();

  async function login(formData: FormData) {
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (!result?.error) {
      router.push("/?loginSuccess=1");
    } else {
      router.push("/?loginError=1");
    }
  }

  return (
    <section className="flex flex-col">
      <h1 className="text-preset-1 text-grey-900 pb-400">Login</h1>

      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          const result = await signIn("credentials", {
            redirect: false,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          });

          if (!result?.error) {
            router.push("/?loginSuccess=1");
          } else {
            router.push("/?loginError=1");
          }
        }}
      >
        <SubmitButton className="mb-100">Login</SubmitButton>
      </Form>

      <GoogleLoginButton />

      <GuestLoginButton />

      <p className="text-sm text-center mt-400 text-gray-600">
        Need to create an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-gray-800 underline"
        >
          Sign Up
        </Link>
      </p>
    </section>
  );
}
