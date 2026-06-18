
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

import { useRouter } from "next/navigation";
import { FaGoogle, FaUserPlus, FaUser, FaPalette } from "react-icons/fa"; 
import { HiEye, HiEyeOff, HiMail } from "react-icons/hi"; 
import { toast } from "react-hot-toast"; 
import Link from 'next/link'; 
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      image: "", 
      role: selectedRole, 
    });

    if (!error) {
      await authClient.signOut();
      toast.success("Registration successful!");
      router.push("/login");
    }

    if (error) {
      toast.error(error.message || "Something went wrong!"); 
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="container mx-auto px-6 py-12 min-h-[90vh] flex items-center justify-center bg-white">
      <Card className="max-w-[550px] w-full p-8 shadow-xl rounded-3xl border border-slate-100 bg-white">
        
        {/* HEADING WITH CUSTOM ARTHUB COLOR */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-950 mb-2">
            Join <span className="text-[#7c3aed]">Art</span><span className="text-[#111827]">Hub</span>
          </h1>
          <p className="text-slate-500 text-sm">Join ArtHub to purchase or publish artwork.</p>
        </div>

        <Form className="flex flex-col gap-5 w-full" onSubmit={onSubmit}>
          
          {/* FULL NAME */}
          <TextField isRequired name="name" type="text" className="w-full">
            <Label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</Label>
            <InputGroup>
              <InputGroup.Input 
                placeholder="e.g. John Doe" 
                className="w-full text-slate-800"
              />
            </InputGroup>
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* EMAIL ADDRESS */}
          <TextField
            isRequired
            name="email"
            type="email"
            className="w-full"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</Label>
            <InputGroup>
              <InputGroup.Input 
                placeholder="email@example.com" 
                className="w-full text-slate-800"
              />
            </InputGroup>
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* ROLE SELECTION */}
          <div className="w-full">
            <Label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Role</Label>
            <div className="grid grid-cols-2 gap-4">
              
              {/* User Buyer Option */}
              <div 
                onClick={() => setSelectedRole("user")}
                className={`cursor-pointer p-4 rounded-xl border-2 text-center transition ${
                  selectedRole === "user" 
                    ? "border-blue-600 bg-blue-50/50" 
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex justify-center mb-1">
                  <FaUser className={`text-lg ${selectedRole === "user" ? "text-blue-600" : "text-slate-400"}`} />
                </div>
                <div className="font-bold text-sm text-slate-950">User (Buyer)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Browse & Buy Art</div>
              </div>

              {/* Artist Option */}
              <div 
                onClick={() => setSelectedRole("artist")}
                className={`cursor-pointer p-4 rounded-xl border-2 text-center transition ${
                  selectedRole === "artist" 
                    ? "border-blue-600 bg-blue-50/50" 
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex justify-center mb-1">
                  <FaPalette className={`text-lg ${selectedRole === "artist" ? "text-blue-600" : "text-slate-400"}`} />
                </div>
                <div className="font-bold text-sm text-slate-950">Artist</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Upload & Sell Art</div>
              </div>

            </div>
          </div>

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
            <Label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</Label>
            <InputGroup>
              <InputGroup.Input 
                placeholder="********" 
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

          {/* REGISTER BUTTON */}
          <div className="flex flex-col gap-3 mt-2">
            <Button 
              type="submit"
              className="w-full font-bold py-6 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-base shadow-md transition flex items-center justify-center gap-2"
            >
              <FaUserPlus className="text-sm" /> 
              REGISTER
            </Button>
          </div>
        </Form>

        {/* OR DIVIDER */}
        <div className="flex items-center my-6 gap-4">
          <div className="h-[1px] flex-1 bg-slate-200"></div>
          <span className="text-slate-400 text-xs font-bold tracking-wider">OR</span>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>

        {/* GOOGLE SIGN IN */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleGoogleSignIn}
            variant="bordered"
            className="w-full font-semibold py-6 border border-slate-200 text-slate-900 rounded-xl text-sm hover:bg-slate-50 transition flex items-center justify-center gap-3 shadow-sm"
          >
            <FaGoogle className="text-red-500 text-base" />
            Register with Google
          </Button>
        </div>

        {/* SWITCH TO SIGN IN */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Sign In Instead
          </Link>
        </p>

      </Card>
    </div>
  );
}