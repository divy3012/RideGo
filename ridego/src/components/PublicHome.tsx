"use client";
import { useState } from "react";
import AuthModel from "./AuthModel";
import HeroSection from "./HeroSection";
import VehicleSlider from "./VehicleSlider";

function PublicHome() {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <HeroSection onAuthRequired={() => setAuthOpen(true)} />
      <VehicleSlider />
      <AuthModel open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default PublicHome;
