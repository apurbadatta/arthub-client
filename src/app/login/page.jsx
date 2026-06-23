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
import { HiEye, HiEyeOff } from "react-icons/hi"; 
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
    <div className="container mx-auto px-6 py-20 min-h-[90vh] bg-[#0b121f] text-white flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        
        {/* LEFT TEXT CONTENT - BRANDING */}
        <div className="lg:max-w-lg space-y-6">
          <span className="text-xs font-bold text-[#7c3aed] uppercase tracking-widest bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-500/20">
            SECURE ACCESS
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Welcome back to <span className="text-[#7c3aed]">Art</span><span className="text-slate-300">Hub</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Manage your listings, explore creative artworks, and keep your gallery dashboard organized in one private space.
          </p>
        </div>

        {/* RIGHT CARD CONTENT */}
        <div className="flex justify-center lg:justify-end">
      
          <Card className="max-w-[480px] w-full p-8 shadow-2xl rounded-[32px] border border-slate-800/80 bg-[#111827]/80 backdrop-blur-md">
            <h1 className="text-3xl font-black text-white mb-6 tracking-wide">Sign In</h1>

            <Form className="flex w-full flex-col gap-5" onSubmit={onSubmit}>
              
              {/* EMAIL FIELD */}
              <TextField isRequired name="email" type="email" className="w-full">
                <Label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email</Label>
                <InputGroup>
                  <InputGroup.Input 
                    placeholder="john@example.com" 
                  
                    className="w-full bg-[#0b121f] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none transition-all"
                  />
                </InputGroup>
                <FieldError className="text-xs text-rose-400 mt-1" />
              </TextField>

      
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
                <Label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Password</Label>
                <InputGroup className="relative flex items-center">
                  <InputGroup.Input 
                    placeholder="Enter your password" 
              
                    className="w-full bg-[#0b121f] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none transition-all"
                    type={isVisible ? "text" : "password"}
                  />
                  <InputGroup.Suffix className="absolute right-3 flex items-center justify-center z-10">
                    <Button
                      isIconOnly
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      size="sm"
                      variant="light"
                      className="text-slate-500 hover:text-slate-300 focus:outline-none text-xl transition-colors"
                      onPress={() => setIsVisible(!isVisible)}
                    >
                      {isVisible ? <HiEyeOff /> : <HiEye />}
                    </Button>
                  </InputGroup.Suffix>
                </InputGroup>
                <Description className="text-[10px] text-slate-500 mt-1.5 block leading-relaxed">
                  Must be at least 8 characters with 1 uppercase and 1 number
                </Description>
                <FieldError className="text-xs text-rose-400 mt-1" />
              </TextField>

              {/* SUBMIT BUTTON */}
              <div className="flex gap-3 mt-2 w-full">
                <Button
                  type="submit"
                  isLoading={loading}
        
                  className="w-full font-bold py-4 bg-[#5c3ef2] hover:bg-[#4c30d3] disabled:bg-purple-900/50 text-white rounded-xl text-sm shadow-lg shadow-purple-900/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
              
                  {!loading && <FaCheck className="text-xs" />} 
                  {loading ? "Checking..." : "Submit"}
                </Button>
              </div>
            </Form>

            {/* OR DIVIDER */}
            <div className="flex items-center my-6 gap-4">
              <div className="h-[1px] flex-1 bg-slate-800"></div>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">OR</span>
              <div className="h-[1px] flex-1 bg-slate-800"></div>
            </div>

            {/* GOOGLE SIGN IN */}
            <Button
              onClick={handleGoogleSignIn}
              variant="bordered"
      
              className="w-full font-bold py-4 border border-slate-800 text-slate-200 rounded-xl text-sm bg-[#0b121f] hover:bg-[#111827] transition flex items-center justify-center gap-3 shadow-sm cursor-pointer"
            >
              <FaGoogle className="text-rose-500 text-base" />
              Continue with Google
            </Button>

       
            <p className="text-center text-xs text-slate-400 mt-8 font-medium">
              Do not have an account?{" "}
              <Link href="/register" className="text-purple-400 font-bold hover:text-purple-300 hover:underline ml-1 transition-colors">
                Register
              </Link>
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}