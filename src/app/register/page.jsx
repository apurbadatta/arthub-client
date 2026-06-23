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
import { HiEye, HiEyeOff } from "react-icons/hi"; 
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
   
    <div className="container mx-auto px-6 py-12 min-h-[90vh] flex items-center justify-center bg-[#0b121f] text-white">
   
      <Card className="max-w-[550px] w-full p-8 shadow-2xl rounded-[32px] border border-slate-800/80 bg-[#111827]/80 backdrop-blur-md">
        
    
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2 tracking-wide">
            Join <span className="text-[#7c3aed]">Art</span><span className="text-slate-300">Hub</span>
          </h1>
          <p className="text-slate-400 text-sm">Join ArtHub to purchase or publish artwork.</p>
        </div>

        <Form className="flex flex-col gap-5 w-full" onSubmit={onSubmit}>
          
          {/* FULL NAME */}
          <TextField isRequired name="name" type="text" className="w-full">
            <Label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Full Name</Label>
            <InputGroup>
              <InputGroup.Input 
                placeholder="e.g. John Doe" 
                className="w-full bg-[#0b121f] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none transition-all"
              />
            </InputGroup>
            <FieldError className="text-xs text-rose-400 mt-1" />
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
            <Label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address</Label>
            <InputGroup>
              <InputGroup.Input 
                placeholder="email@example.com" 
                className="w-full bg-[#0b121f] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none transition-all"
              />
            </InputGroup>
            <FieldError className="text-xs text-rose-400 mt-1" />
          </TextField>

 
          <div className="w-full">
            <Label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Select Role</Label>
            <div className="grid grid-cols-2 gap-4">
              
          
              <div 
                onClick={() => setSelectedRole("user")}
                className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  selectedRole === "user" 
                    ? "border-[#7c3aed] bg-[#7c3aed]/10" 
                    : "border-slate-800 bg-[#0b121f] hover:border-slate-700"
                }`}
              >
                <div className="flex justify-center mb-1">
                  <FaUser className={`text-lg ${selectedRole === "user" ? "text-[#7c3aed]" : "text-slate-500"}`} />
                </div>
                <div className="font-bold text-sm text-white">User (Buyer)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Browse & Buy Art</div>
              </div>

        
              <div 
                onClick={() => setSelectedRole("artist")}
                className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  selectedRole === "artist" 
                    ? "border-[#7c3aed] bg-[#7c3aed]/10" 
                    : "border-slate-800 bg-[#0b121f] hover:border-slate-700"
                }`}
              >
                <div className="flex justify-center mb-1">
                  <FaPalette className={`text-lg ${selectedRole === "artist" ? "text-[#7c3aed]" : "text-slate-500"}`} />
                </div>
                <div className="font-bold text-sm text-white">Artist</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Upload & Sell Art</div>
              </div>

            </div>
          </div>

     
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
                placeholder="********" 
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

  
          <div className="flex flex-col gap-3 mt-2">
            <Button 
              type="submit"
              className="w-full font-bold py-4 bg-[#5c3ef2] hover:bg-[#4c30d3] text-white rounded-xl text-sm shadow-lg shadow-purple-900/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <FaUserPlus className="text-xs" /> 
              REGISTER
            </Button>
          </div>
        </Form>

 
        <div className="flex items-center my-6 gap-4">
          <div className="h-[1px] flex-1 bg-slate-800"></div>
          <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">OR</span>
          <div className="h-[1px] flex-1 bg-slate-800"></div>
        </div>

    
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleGoogleSignIn}
            variant="bordered"
            className="w-full font-bold py-4 border border-slate-800 text-slate-200 rounded-xl text-sm bg-[#0b121f] hover:bg-[#111827] transition flex items-center justify-center gap-3 shadow-sm cursor-pointer"
          >
            <FaGoogle className="text-rose-500 text-base" />
            Register with Google
          </Button>
        </div>

        
        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 font-bold hover:text-purple-300 hover:underline ml-1 transition-colors">
            Sign In Instead
          </Link>
        </p>

      </Card>
    </div>
  );
}