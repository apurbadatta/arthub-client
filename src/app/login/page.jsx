"use client";
import { authClient } from "@/lib/auth-client";
import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import Link from "next/link"; 
import { FaGoogle, FaCheck } from "react-icons/fa"; 
import { HiEye, HiEyeOff, HiLockClosed, HiMail } from "react-icons/hi"; 
import { toast } from "react-hot-toast"; 
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (data) {
      toast.success("Success! You have signed in.");
    }
    if (error) {
      toast.error(error.message || "Something went wrong! Please try again");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="container mx-auto px-6 py-20 min-h-[90vh]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT TEXT CONTENT - BRANDING FROM image_9d41b1.png */}
        <div className="lg:max-w-lg space-y-6">
          <span className="text-xs font-bold text-[#7c3aed] uppercase tracking-widest">
            SECURE ACCESS
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-950 leading-tight tracking-tight">
            Welcome back to <span className="text-[#7c3aed]">Art</span><span className="text-[#111827]">Hub</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Manage your listings, explore creative artworks, and keep your gallery dashboard organized in one private space.
          </p>
        </div>

        {/* RIGHT CARD CONTENT */}
        <div className="flex justify-center lg:justify-end">
          <Card className="max-w-[480px] w-full p-8 shadow-2xl rounded-3xl border border-slate-100 bg-white">
            <h1 className="text-3xl font-black text-slate-950 mb-6">Sign In</h1>

            <Form className="flex w-full flex-col gap-5" onSubmit={onSubmit}>
              
              {/* EMAIL FIELD */}
              <TextField isRequired name="email" type="email" className="w-full">
                <Label className="block text-sm font-bold text-slate-700 mb-2">Email</Label>
                <InputGroup>
                  <InputGroup.Input 
                    placeholder="john@example.com" 
                    className="w-full text-slate-800"
                  />
                </InputGroup>
                <FieldError className="text-xs text-red-500 mt-1" />
              </TextField>

              {/* PASSWORD FIELD WITH NEW TOGGLE STRATEGY */}
              <TextField
                isRequired
                minLength={8}
                name="password"
                className="w-full"
                validate={(value) => {
                  if (value.length < 8) return "Password must be at least 8 characters";
                  if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
                  if (!/[0-9]/.test(value)) return "Password must contain at least one number";
                  return null;
                }}
              >
                <Label className="block text-sm font-bold text-slate-700 mb-2">Password</Label>
                <InputGroup>
                  <InputGroup.Input 
                    placeholder="Enter your password" 
                    className="w-full text-slate-800"
                    type={isVisible ? "text" : "password"}
                  />
                  <InputGroup.Suffix className="pr-3 flex items-center justify-center">
                    <Button
                      isIconOnly
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      size="sm"
                      variant="light"
                      className="text-slate-400 hover:text-slate-600 focus:outline-none text-xl"
                      onPress={() => setIsVisible(!isVisible)}
                    >
                      {isVisible ? <HiEyeOff /> : <HiEye />}
                    </Button>
                  </InputGroup.Suffix>
                </InputGroup>
                <Description className="text-[11px] text-slate-400 mt-1 block">
                  Must be at least 8 characters with 1 uppercase and 1 number
                </Description>
                <FieldError className="text-xs text-red-500 mt-1" />
              </TextField>

              {/* SUBMIT BUTTON */}
              <div className="flex gap-3 mt-2 w-full">
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full font-bold py-7 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-base shadow-md transition flex items-center justify-center gap-2"
                >
                  {!loading && <FaCheck className="text-sm" />} 
                  {loading ? "Checking..." : "Submit"}
                </Button>
              </div>
            </Form>

            {/* OR DIVIDER */}
            <div className="flex items-center my-6 gap-4">
              <div className="h-[1px] flex-1 bg-slate-200"></div>
              <span className="text-slate-400 text-sm font-medium">OR</span>
              <div className="h-[1px] flex-1 bg-slate-200"></div>
            </div>

            {/* GOOGLE SIGN IN */}
            <Button
              onClick={handleGoogleSignIn}
              variant="bordered"
              className="w-full font-bold py-7 border border-slate-200 text-slate-900 rounded-2xl text-base hover:bg-slate-50 transition flex items-center justify-center gap-3 shadow-sm"
            >
              <FaGoogle className="text-red-500 text-lg" />
              Continue with Google
            </Button>

            {/* REGISTER NAVIGATION */}
            <p className="text-center text-sm text-slate-600 mt-8">
              Do not have an account?{" "}
              <Link href="/register" className="text-blue-600 font-bold hover:underline">
                Register
              </Link>
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}