import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  KeyRound,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { oAuthClientId, firebaseConfig } from "../lib/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GoogleAuthIssue {
  type: "unauthorized_domain" | "operation_not_allowed" | "popup_blocked" | "configuration_not_found" | "other";
  title: string;
  message: string;
  domain?: string;
  rawCode?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    isAnonymous,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGoogleRedirect,
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
  const [googleIssue, setGoogleIssue] = useState<GoogleAuthIssue | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [copiedClientId, setCopiedClientId] = useState(false);
  const [copiedAppId, setCopiedAppId] = useState(false);

  if (!isOpen) return null;

  const currentHost = typeof window !== "undefined" ? window.location.hostname : "";

  const handleCopyDomain = async () => {
    if (!currentHost) return;
    try {
      await navigator.clipboard.writeText(currentHost);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    } catch {
      // Safe fallback
    }
  };

  const handleCopyClientId = async () => {
    if (!oAuthClientId) return;
    try {
      await navigator.clipboard.writeText(oAuthClientId);
      setCopiedClientId(true);
      setTimeout(() => setCopiedClientId(false), 2500);
    } catch {
      // Safe fallback
    }
  };

  const handleCopyAppId = async () => {
    if (!firebaseConfig.appId) return;
    try {
      await navigator.clipboard.writeText(firebaseConfig.appId);
      setCopiedAppId(true);
      setTimeout(() => setCopiedAppId(false), 2500);
    } catch {
      // Safe fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleIssue(null);
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
      if (code === "auth/configuration-not-found") {
        setGoogleIssue({
          type: "configuration_not_found",
          title: "Firebase Authentication Not Yet Activated",
          message: "Firebase Authentication has not been initialized for this project in the Firebase Console yet. Click 'Get started' in the Firebase Console to enable it.",
          rawCode: code,
        });
        return;
      }
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

  const handleGoogleSignIn = async (preferRedirect = false) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleIssue(null);
    setLoading(true);

    try {
      await signInWithGoogle(preferRedirect);
      onClose();
    } catch (err: any) {
      const code = err?.code || "";
      console.warn("Google auth encountered issue:", code, err);

      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setErrorMsg("Google sign-in popup was closed. You can try again or use email sign-in.");
      } else if (code === "auth/configuration-not-found") {
        setGoogleIssue({
          type: "configuration_not_found",
          title: "Firebase Authentication Not Yet Activated",
          message: "Firebase Authentication has not been initialized for this project in the Firebase Console yet. Click 'Get started' in the Firebase Console to enable it.",
          rawCode: code,
        });
      } else if (code === "auth/unauthorized-domain") {
        setGoogleIssue({
          type: "unauthorized_domain",
          title: "Domain Not Yet Authorized in Firebase",
          message: `Firebase blocks Google OAuth from custom domains until added to the Authorized Domains list. To enable Google login here, add "${currentHost}" in your Firebase Console.`,
          domain: currentHost,
          rawCode: code,
        });
      } else if (code === "auth/operation-not-allowed") {
        setGoogleIssue({
          type: "operation_not_allowed",
          title: "Google Sign-In Provider Disabled",
          message: "Google Sign-In is not enabled yet in your Firebase Project. Enable it under Firebase Console > Authentication > Sign-in method.",
          rawCode: code,
        });
      } else if (code === "auth/popup-blocked") {
        setGoogleIssue({
          type: "popup_blocked",
          title: "Browser Blocked the Sign-In Popup",
          message: "Your browser prevented the Google login window from opening. Tap below to use full-page redirect authentication instead.",
          rawCode: code,
        });
      } else {
        setGoogleIssue({
          type: "other",
          title: "Google Authentication Error",
          message: err?.message || "An unexpected error occurred during Google Sign-In. You can sign in using Email or Guest mode.",
          rawCode: code || "auth/unknown",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo account login for immediate sync testing
  const handleQuickDemoLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    const demoEmail = "believer@muslimdaily.app";
    const demoPass = "MuslimDaily2026!";

    try {
      await signInWithEmail(demoEmail, demoPass);
      onClose();
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/configuration-not-found") {
        setGoogleIssue({
          type: "configuration_not_found",
          title: "Firebase Authentication Not Activated in Project",
          message: "Firebase Authentication has not been initialized for this Google Cloud project. You need to click 'Get started' once in the Firebase Console.",
          rawCode: code,
        });
        return;
      }
      // If demo user does not exist yet in project, auto-create it
      try {
        await signUpWithEmail(demoEmail, demoPass, "Dev Believer");
        onClose();
      } catch (createErr: any) {
        const createCode = createErr?.code || "";
        if (createCode === "auth/configuration-not-found") {
          setGoogleIssue({
            type: "configuration_not_found",
            title: "Firebase Authentication Not Activated in Project",
            message: "Firebase Authentication has not been initialized for this Google Cloud project. You need to click 'Get started' once in the Firebase Console.",
            rawCode: createCode,
          });
          return;
        }
        setErrorMsg("Could not activate demo account. Please create your own account below.");
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
      <div className="w-full max-w-md bg-[#F2F2F7] rounded-t-[28px] sm:rounded-[28px] border border-black/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
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
                onClick={() => handleGoogleSignIn(false)}
                disabled={loading}
                className="w-full py-2.5 px-3 rounded-[14px] bg-white border border-black/10 font-semibold text-xs text-[#1C1C1E] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs cursor-pointer hover:bg-black/[0.02] disabled:opacity-60"
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
                <span>{loading ? "Connecting to Google..." : "Continue with Google"}</span>
              </button>

              {/* Dedicated Diagnostic & Recovery Box for Google OAuth issues */}
              {googleIssue && (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 space-y-2.5 animate-fadeIn shadow-xs">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs text-amber-900 leading-snug">
                        {googleIssue.title}
                      </p>
                      <p className="text-[11px] text-amber-800/95 mt-1 leading-relaxed">
                        {googleIssue.message}
                      </p>
                      {googleIssue.rawCode && (
                        <p className="text-[10px] font-mono text-amber-700/80 mt-1">
                          Code: {googleIssue.rawCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {googleIssue.type === "configuration_not_found" && (
                    <div className="pt-2 border-t border-amber-200/70 space-y-2.5">
                      <div className="bg-white/90 p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 space-y-2.5 shadow-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-[#007A78]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Resolve auth/configuration-not-found (Quick Checklist):</span>
                        </div>
                        <ol className="list-decimal pl-4 space-y-2 text-slate-700">
                          <li>
                            <div className="font-semibold text-slate-900">Activate Firebase Authentication:</div>
                            <p className="text-[10.5px] text-slate-600 mt-0.5">
                              Open the Auth Console and click the blue <strong>"Get started"</strong> button to provision Identity Platform.
                            </p>
                            <div className="mt-1">
                              <a
                                href="https://console.firebase.google.com/project/gen-lang-client-0725368052/authentication"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#007A78] hover:bg-[#00695C] text-white rounded-lg font-medium text-[11px] shadow-xs"
                              >
                                <span>1. Open Firebase Auth &rarr; Click 'Get started'</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </li>
                          <li>
                            <div className="font-semibold text-slate-900">Enable Google Provider & OAuth Client ID:</div>
                            <p className="text-[10.5px] text-slate-600 mt-0.5">
                              Go to <strong>Sign-in method &rarr; Google &rarr; Enable</strong>. Select your support email.
                            </p>
                            {oAuthClientId && (
                              <div className="mt-1 p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase font-bold text-slate-500">Your OAuth Client ID</span>
                                  <button
                                    type="button"
                                    onClick={handleCopyClientId}
                                    className="px-2 py-0.5 bg-white border border-slate-300 text-slate-700 rounded text-[10px] font-medium flex items-center gap-1 hover:bg-slate-100 cursor-pointer shadow-xs active:scale-95"
                                  >
                                    {copiedClientId ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        <span className="text-emerald-700 font-semibold">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3 text-slate-600" />
                                        <span>Copy Client ID</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <code className="block text-[9.5px] font-mono text-slate-800 break-all select-all">
                                  {oAuthClientId}
                                </code>
                              </div>
                            )}
                            <div className="mt-1">
                              <a
                                href="https://console.firebase.google.com/project/gen-lang-client-0725368052/authentication/providers"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-[11px] shadow-xs"
                              >
                                <span>2. Open Sign-in Providers</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </li>
                          <li>
                            <div className="font-semibold text-slate-900">Verify Firebase Web App:</div>
                            <p className="text-[10.5px] text-slate-600 mt-0.5">
                              In <strong>Project Settings &rarr; General</strong>, verify your Web App is registered.
                            </p>
                            {firebaseConfig.appId && (
                              <div className="mt-1 p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Web App ID</span>
                                  <code className="text-[10px] font-mono text-slate-800">{firebaseConfig.appId}</code>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleCopyAppId}
                                  className="px-2 py-0.5 bg-white border border-slate-300 text-slate-700 rounded text-[10px] font-medium flex items-center gap-1 hover:bg-slate-100 cursor-pointer shadow-xs active:scale-95"
                                >
                                  {copiedAppId ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span className="text-emerald-700 font-semibold">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-slate-600" />
                                      <span>Copy App ID</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                            <div className="mt-1">
                              <a
                                href="https://console.firebase.google.com/project/gen-lang-client-0725368052/settings/general"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-medium text-[11px] shadow-xs"
                              >
                                <span>3. Open Project Settings (Your Apps)</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </li>
                          <li>
                            <div className="font-semibold text-slate-900">Done! Return and Sign In:</div>
                            <p className="text-[10.5px] text-slate-600 mt-0.5">
                              Once saved in Firebase Console, return here and tap <strong>Continue with Google</strong>!
                            </p>
                          </li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {googleIssue.type === "unauthorized_domain" && (
                    <div className="pt-1.5 border-t border-amber-200/70 space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleCopyDomain}
                          className="px-2.5 py-1 bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          {copiedDomain ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">Copied "{currentHost}"!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-amber-700" />
                              <span>Copy "{currentHost}"</span>
                            </>
                          )}
                        </button>
                        <a
                          href="https://console.firebase.google.com/project/gen-lang-client-0725368052/authentication/settings"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all shadow-xs"
                        >
                          <span>Open Firebase Settings</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-[10.5px] text-amber-800 leading-normal">
                        <strong>Steps:</strong> Go to Firebase Console &rarr; Authentication &rarr; Settings &rarr; Authorized domains &rarr; Add domain &rarr; paste <code>{currentHost}</code>.
                      </p>
                    </div>
                  )}

                  {googleIssue.type === "operation_not_allowed" && (
                    <div className="pt-1 border-t border-amber-200/70">
                      <a
                        href="https://console.firebase.google.com/project/gen-lang-client-0725368052/authentication/providers"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-medium transition-all shadow-xs"
                      >
                        <span>Enable Google Provider</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {googleIssue.type === "popup_blocked" && (
                    <div className="pt-1 border-t border-amber-200/70">
                      <button
                        type="button"
                        onClick={() => handleGoogleSignIn(true)}
                        className="px-2.5 py-1.5 bg-[#007A78] hover:bg-[#00695C] text-white rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <span>Sign In with Full Redirect</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* 1-Click Fallback notice */}
                  <div className="pt-1 text-[10.5px] text-amber-900/80 font-medium">
                    Tip: You can instantly sign in using Email or 1-Click Demo Login below without editing Firebase settings!
                  </div>
                </div>
              )}

              {/* 1-Click Instant Demo Login shortcut */}
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#007A78] shrink-0" />
                  <div>
                    <p className="font-semibold text-xs text-[#007A78] leading-none">Instant 1-Click Sign In</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Test Firestore cloud sync immediately</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  disabled={loading}
                  className="px-2.5 py-1 bg-[#007A78] hover:bg-[#00695C] text-white font-semibold text-[11px] rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  Test Login
                </button>
              </div>

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
                  className="text-[11px] text-[#8E8E93] hover:text-[#007A78] transition-colors cursor-pointer"
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
