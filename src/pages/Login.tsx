import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginWithCredentials,
  loginWithGoogleEmail,
  isAuthenticated,
  DEFAULT_USERNAME,
  DEFAULT_PASSWORD,
  ALLOWED_GOOGLE_EMAIL,
} from "@/lib/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

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

  const handleGoogle = () => {
    // Placeholder for Google Sign-In. Replace with real OAuth as needed.
    const email = window.prompt("Enter Google account email");
    if (!email) return;
    const ok = loginWithGoogleEmail(email.trim());
    if (ok) {
      const to = (location.state as any)?.from?.pathname ?? "/";
      navigate(to, { replace: true });
    } else {
      setError(`Access restricted. Allowed email: ${ALLOWED_GOOGLE_EMAIL}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-md bg-white shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">Sign In</h1>
        <p className="text-xs text-gray-500 text-center">
          Default credentials: <span className="font-mono">{DEFAULT_USERNAME}</span> / <span className="font-mono">{DEFAULT_PASSWORD}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <div className="text-center">
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
            Sign in with Google (restricted)
          </Button>
          <p className="text-[11px] text-gray-500 mt-2">Allowed Google email: <span className="font-mono">{ALLOWED_GOOGLE_EMAIL}</span></p>
        </div>
      </div>
    </div>
  );
}