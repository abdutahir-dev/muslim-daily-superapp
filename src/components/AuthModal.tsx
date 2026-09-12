import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    isAnonymous,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendPasswordReset,
    signOutUser,
    signInAsGuest,
    lastSyncedAt,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        await signUpWithEmail(email, password, displayName || undefined);
        onClose();
      } else if (mode === "signin") {
        await signInWithEmail(email, password);
        onClose();
      } else if (mode === "forgot") {
        await sendPasswordReset(email);
        setSuccessMsg("Password reset link sent to your email.");
      }
    } catch (err: any) {
      const code = err?.code || "";
      let message = "Authentication failed. Please verify your credentials.";
      if (code === "auth/email-already-in-use") {
        message = "This email is already registered. Please sign in instead.";
      } else if (code === "auth/weak-password") {
        message = "Password must be at least 6 characters.";
      } else if (
        code === "auth/invalid-credential" ||
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-email"
      ) {
        message = "Invalid email or password.";
      } else if (
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request"
      ) {
        message = "Sign-in was cancelled.";
      } else if (code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again in a few moments.";
      } else if (err?.message) {
        message = err.message;
      }
      console.warn("Auth request info:", code || err?.message || err);
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      const code = err?.code || "";
      if (
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request"
      ) {
        // Expected user action when dismissing the Google sign-in window
        console.info("Google sign-in popup was dismissed by user.");
        // Clear or show subtle status instead of an error state
        setErrorMsg("Google sign-in was cancelled. You can try again or use email sign-in.");
      } else if (code === "auth/popup-blocked") {
        console.warn("Google sign-in popup blocked by browser:", err);
        setErrorMsg(
          "The sign-in popup was blocked by your browser. Please allow popups or use email sign-in below."
        );
      } else if (code === "auth/unauthorized-domain") {
        console.warn("Google sign-in unauthorized domain:", err);
        setErrorMsg(
          "This domain is not yet authorized in Firebase Console. Please use email sign-in or guest mode."
        );
      } else {
        console.warn("Google sign in notice:", err?.message || err);
        setErrorMsg("Failed to sign in with Google. You can use email login instead.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    onClose();
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    try {
      await signInAsGuest();
      onClose();
    } catch (err) {
      console.warn("Guest mode notice:", err);
      setErrorMsg("Could not enter guest mode. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-[#F2F2F7] rounded-t-[28px] sm:rounded-[28px] border border-black/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* iOS Grabber & Navigation Header */}
        <div className="pt-2.5 pb-2 px-4 bg-white/95 border-b border-black/[0.08] sticky top-0 z-10 shrink-0">
          <div className="w-9 h-1 bg-[#8E8E93]/40 rounded-full mx-auto mb-2" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1C1C1E]">
              {user && !isAnonymous ? "Account Profile" : "Firebase Account Sync"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-[#007A78] hover:text-[#006260] active:scale-95 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3.5 text-xs overflow-y-auto">
          {/* Active Logged-in State */}
          {user && !isAnonymous ? (
            <div className="space-y-3">
              <div className="ios-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#007A78] font-semibold text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#007A78]" />
                    <span>Firebase Authenticated</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759] font-medium">
                    Active
                  </span>
                </div>
                
                <div className="pt-1 space-y-1">
                  <p className="text-[#3A3A3C]">
                    <span className="font-semibold text-[#1C1C1E]">Email:</span> {user.email || "Linked Account"}
                  </p>
                  {user.displayName && (
                    <p className="text-[#3A3A3C]">
                      <span className="font-semibold text-[#1C1C1E]">Name:</span> {user.displayName}
                    </p>
                  )}
                  <p className="text-[11px] text-[#8E8E93]">
                    <span className="font-medium text-[#1C1C1E]">Cloud Sync:</span>{" "}
                    {lastSyncedAt ? `Synced at ${lastSyncedAt.toLocaleTimeString()}` : "Cloud Firestore active"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#34C759] font-medium pt-1.5 border-t border-black/[0.05]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Your prayers, Quran bookmarks & dhikr counters are safely backed up.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-[14px] bg-white border border-[#FF3B30]/30 text-[#FF3B30] font-semibold flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer transition-transform shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Sign In / Sign Up Form */
            <div className="space-y-3">
              {/* Google Fast Login Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-3 rounded-[14px] bg-white border border-black/10 font-semibold text-xs text-[#1C1C1E] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs cursor-pointer hover:bg-black/[0.02]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-black/[0.08]" />
                <span className="flex-shrink mx-2 text-[10px] text-[#8E8E93] uppercase font-semibold">Or with Email</span>
                <div className="flex-grow border-t border-black/[0.08]" />
              </div>

              {/* iOS Segmented Control */}
              <div className="ios-segmented-control grid grid-cols-2 gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`py-1.5 text-xs font-semibold ios-segmented-button cursor-pointer ${
                    mode === "signin" ? "ios-segmented-button-active" : "text-[#8E8E93]"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`py-1.5 text-xs font-semibold ios-segmented-button cursor-pointer ${
                    mode === "signup" ? "ios-segmented-button-active" : "text-[#8E8E93]"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-[12px] bg-[#FF3B30]/10 text-[#FF3B30] text-xs flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 rounded-[12px] bg-[#34C759]/10 text-[#34C759] text-xs flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div className="ios-card divide-y divide-black/[0.06] overflow-hidden">
                  {mode === "signup" && (
                    <div className="p-2.5">
                      <label className="block text-[#8E8E93] text-[10px] uppercase font-medium mb-1">Display Name</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Tariq Ahmad"
                        className="w-full bg-transparent text-xs text-[#1C1C1E] focus:outline-none placeholder:text-[#8E8E93]"
                      />
                    </div>
                  )}

                  <div className="p-2.5">
                    <label className="block text-[#8E8E93] text-[10px] uppercase font-medium mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-transparent text-xs text-[#1C1C1E] focus:outline-none placeholder:text-[#8E8E93]"
                    />
                  </div>

                  {mode !== "forgot" && (
                    <div className="p-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[#8E8E93] text-[10px] uppercase font-medium">Password</label>
                        {mode === "signin" && (
                          <button
                            type="button"
                            onClick={() => {
                              setMode("forgot");
                              setErrorMsg(null);
                              setSuccessMsg(null);
                            }}
                            className="text-[10px] text-[#007A78] hover:underline"
                          >
                            Forgot?
                          </button>
                        )}
                      </div>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-xs text-[#1C1C1E] focus:outline-none placeholder:text-[#8E8E93]"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-[14px] bg-[#007A78] active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50 mt-1"
                >
                  {loading
                    ? "Processing..."
                    : mode === "signin"
                    ? "Sign In"
                    : mode === "signup"
                    ? "Create Account & Sync"
                    : "Send Reset Link"}
                </button>

                {mode === "forgot" && (
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="w-full py-1 text-center text-xs text-[#8E8E93] hover:text-[#1C1C1E]"
                  >
                    Back to Sign In
                  </button>
                )}
              </form>

              {/* Continue as Guest option */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  className="text-[11px] text-[#8E8E93] hover:text-[#007A78] transition-colors"
                >
                  Continue using local Guest Mode
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
