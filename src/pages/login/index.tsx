
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { loginWithCredentials } from "@/lib/auth";
import LightRays from "@/components/LightRays";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = loginWithCredentials(username.trim(), password);
    if (ok) {
      const to = (location.state as any)?.from?.pathname ?? "/";
      navigate(to, { replace: true });
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen w-full  bg-gray-300">

      <div className="relative flex w-full h-screen overflow-hidden bg-white shadow-xl">
        {/* Left Section (Green) */}

        <div className="relative hidden w-1/2 flex-col items-center bg-black justify-center b p-8 text-white lg:flex">

          <div className="absolute top-0 w-full h-full">
            <LightRays
              raysOrigin="top-center"
              raysColor="#00ffff"
              raysSpeed={1.5}
              lightSpread={1.8}
              rayLength={3.2}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
              className="custom-rays"
            />
          </div>
          <div className="absolute left-0 top-0 h-full w-full opacity-90"></div>
          <div className="relative z-10 text-center">
            {/* Placeholder for logo */}
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-white flex items-center justify-center">
                <img src="Dezprox white circle logo.png" alt="" className="w-32 h-32" />
              </div>
            </div>
            <h2 className="mb-2 text-3xl font-bold">Dezprox Invoice System!</h2>
            <p className="mb-6 text-sm opacity-80">
              Sign in to manage and track your invoices
            </p>
          </div>
        </div>

        {/* Right Section (White) */}
        <div className="w-full p-8 lg:w-1/2 flex items-center justify-center">
          <div className="w-[400px] h-full flex flex-col justify-center">
            <h1 className="mb-2 text-center text-3xl font-bold text-green-700">welcome</h1>
            <p className="mb-6 text-center text-sm text-gray-600">
              Login to your account to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username" className="sr-only">
                  Email
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="rounded-full border-gray-300 text-center focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-1 relative">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="rounded-full border-gray-300 text-center pr-10 focus:border-green-500 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-1/2 mx-auto rounded-full bg-green-600 hover:bg-green-700 block"
              >
                LOG IN
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
