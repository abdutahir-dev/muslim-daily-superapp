import React, { useState, useEffect } from "react";
import {
  Compass,
  MapPin,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { calculateQiblaDirection, KAABA_COORDINATES } from "../lib/prayerTimes";

export const QiblaApp: React.FC = () => {
  const { preferences, requestGeolocation } = useAuth();
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasSensor, setHasSensor] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [manualHeading, setManualHeading] = useState<number>(0);

  // Calculate Qibla bearing and distance from user's coordinates
  const qiblaData = calculateQiblaDirection(preferences.latitude, preferences.longitude);
  const targetBearing = qiblaData.bearingDegrees;

  // Effective current heading (sensor or manual slider)
  const currentHeading = hasSensor ? deviceHeading : manualHeading;

  // Calculate relative angle difference
  const angleDiff = (targetBearing - currentHeading + 360) % 360;
  const isAligned = angleDiff <= 3 || angleDiff >= 357;

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let heading = 0;
      if ((event as any).webkitCompassHeading !== undefined) {
        heading = (event as any).webkitCompassHeading;
        setHasSensor(true);
      } else if (event.alpha !== null) {
        heading = 360 - event.alpha;
        setHasSensor(true);
      }

      setDeviceHeading(Math.round(heading));
    };

    const win = window as any;
    if (typeof window !== "undefined" && "ondeviceorientationabsolute" in window) {
      win.addEventListener("deviceorientationabsolute", handleOrientation, true);
    } else if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      win.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      win.removeEventListener?.("deviceorientation", handleOrientation);
      win.removeEventListener?.("deviceorientationabsolute", handleOrientation);
    };
  }, []);

  const requestSensorPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === "granted") {
          setPermissionDenied(false);
          setHasSensor(true);
        } else {
          setPermissionDenied(true);
        }
      } catch (err) {
        console.warn("Sensor permission request error:", err);
      }
    }
  };

  return (
    <div id="qibla-compass-mini-app" className="space-y-3.5 pb-20">
      {/* iOS Header */}
      <div className="ios-card p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-[#1C1C1E]">
              Qibla Compass
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#007A78]/10 text-[#007A78] font-bold font-mono">
              {targetBearing}° N
            </span>
          </div>
          <p className="text-[11px] text-[#8E8E93] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#007A78]" />
            <span>From {preferences.city} to Holy Kaaba</span>
          </p>
        </div>

        <button
          type="button"
          onClick={requestGeolocation}
          className="h-7 px-2.5 rounded-full bg-[#767680]/10 hover:bg-[#767680]/15 active:scale-95 text-xs font-semibold text-[#1C1C1E] flex items-center gap-1 transition-all cursor-pointer"
          title="Refresh GPS Coordinates"
        >
          <RefreshCw className="w-3 h-3 text-[#007A78]" />
          <span>GPS</span>
        </button>
      </div>

      {/* Alignment Status Banner */}
      <div
        className={`p-3.5 ios-card transition-all flex items-center justify-between ${
          isAligned ? "bg-[#34C759]/10 border-[#34C759]/30" : ""
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              isAligned ? "bg-[#34C759] text-white shadow-xs" : "bg-[#767680]/10 text-[#8E8E93]"
            }`}
          >
            {isAligned ? <CheckCircle2 className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#1C1C1E] leading-tight">
              {isAligned ? "Facing Holy Kaaba" : "Align Compass to Makkah"}
            </h4>
            <p className="text-[10px] text-[#8E8E93]">
              Qibla is <span className="font-semibold text-[#1C1C1E]">{targetBearing}°</span> from True North
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-[#1C1C1E]">
            {qiblaData.distanceKm.toLocaleString()} km
          </span>
          <p className="text-[9px] text-[#8E8E93]">Distance</p>
        </div>
      </div>

      {/* Apple iOS Compass Dial */}
      <div className="ios-card p-6 flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Outer dial ring */}
          <div
            className={`absolute inset-0 rounded-full border-[3px] transition-colors duration-300 ${
              isAligned ? "border-[#34C759] shadow-lg shadow-[#34C759]/15" : "border-black/[0.08]"
            }`}
          />

          {/* Compass Dial Rotating with Heading */}
          <div
            className="w-full h-full relative transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${-currentHeading}deg)` }}
          >
            {/* Cardinal Marks */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-black text-[#FF3B30]">
              N
            </span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-[#8E8E93]">
              S
            </span>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8E93]">
              E
            </span>
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8E93]">
              W
            </span>

            {/* Degree ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={deg}
                className="absolute top-0 left-1/2 w-0.5 h-full -translate-x-1/2 pointer-events-none"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <div className={`w-0.5 ${deg % 90 === 0 ? "h-3 bg-[#8E8E93]" : "h-1.5 bg-[#C7C7CC]"}`} />
              </div>
            ))}

            {/* Kaaba Direction Marker */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none transition-transform"
              style={{ transform: `rotate(${targetBearing}deg)` }}
            >
              <div className="flex flex-col items-center -mt-3.5 z-20">
                <div
                  className={`w-7 h-7 rounded-[8px] flex items-center justify-center text-white text-xs font-bold shadow-md transition-all ${
                    isAligned ? "bg-[#34C759] scale-110" : "bg-[#007A78]"
                  }`}
                  title="Kaaba Direction"
                >
                  🕋
                </div>
                <div className="w-0.5 h-16 bg-gradient-to-b from-[#007A78] to-transparent" />
              </div>
            </div>
          </div>

          {/* Center Hub */}
          <div className="absolute w-12 h-12 rounded-full bg-[#1C1C1E] text-white flex flex-col items-center justify-center shadow-md z-30">
            <span className="text-[11px] font-mono font-bold">{currentHeading}°</span>
          </div>
        </div>

        {/* Manual Calibration Slider for preview */}
        <div className="w-full max-w-xs mt-6 pt-4 border-t border-black/[0.06]">
          <div className="flex items-center justify-between text-xs text-[#8E8E93] mb-1.5">
            <span className="font-medium">Device Heading</span>
            <span className="font-mono font-semibold text-[#1C1C1E]">{manualHeading}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="359"
            value={manualHeading}
            onChange={(e) => {
              setHasSensor(false);
              setManualHeading(Number(e.target.value));
            }}
            className="w-full accent-[#007A78] cursor-pointer"
          />
        </div>

        {/* iOS Permission Prompt */}
        {!hasSensor && typeof DeviceOrientationEvent !== "undefined" && (
          <button
            type="button"
            onClick={requestSensorPermission}
            className="mt-3 text-xs text-[#007A78] font-semibold hover:underline active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Enable Gyroscope Sensor</span>
          </button>
        )}
      </div>

      {/* Coordinates Inset Grouped Card */}
      <div className="ios-card p-3.5 grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[#8E8E93] block text-[10px]">Your Coordinates</span>
          <span className="font-mono font-semibold text-[#1C1C1E]">
            {preferences.latitude.toFixed(4)}°, {preferences.longitude.toFixed(4)}°
          </span>
        </div>
        <div>
          <span className="text-[#8E8E93] block text-[10px]">Holy Kaaba</span>
          <span className="font-mono font-semibold text-[#1C1C1E]">
            {KAABA_COORDINATES.lat.toFixed(4)}°, {KAABA_COORDINATES.lng.toFixed(4)}°
          </span>
        </div>
      </div>
    </div>
  );
};
