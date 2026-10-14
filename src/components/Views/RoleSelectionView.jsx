import React, { useState } from 'react';
import { 
  Globe, 
  Sun, 
  Moon, 
  HelpCircle, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  X, 
  ShieldCheck, 
  Award, 
  FlaskConical, 
  Sparkles, 
  Layers, 
  UserCheck, 
  Settings, 
  GraduationCap,
  Building2,
  PhoneCall,
  Mail,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { mockPersonas } from '../../data/mockData';
import { LabCertifyLogo } from '../Common/LabCertifyLogo';

/* ============================================================
   Custom Vector Illustrations matching the exact medical palette:
   - #DEE2E8 (Bleached White)
   - #C0CAD8 (Icy Brook)
   - #6BBADA (Bluebrite)
   - #9995A6 (Lavender Ash)
   - #0B96C7 (Sea Wonder - Primary CTA)
   - #485261 (Senate - Dark Heading/Contrast)
   ============================================================ */

// 1. Medical Laboratory Trainee Illustration
const MedicalTraineeIllustration = ({ isSelected }) => (
  <svg viewBox="0 0 260 180" className="w-full h-full max-h-[125px] sm:max-h-[135px] transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Subtle Floor Shadow */}
    <ellipse cx="130" cy="162" rx="95" ry="12" fill="#C0CAD8" fillOpacity="0.5" />
    
    {/* Office / Lab Desk */}
    <path d="M45 125 L215 125 L200 133 L60 133 Z" fill="#DEE2E8" />
    <rect x="52" y="128" width="156" height="5" rx="2.5" fill="#C0CAD8" />
    {/* Desk Legs */}
    <line x1="68" y1="133" x2="68" y2="162" stroke="#9995A6" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="192" y1="133" x2="192" y2="162" stroke="#9995A6" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="64" y1="162" x2="72" y2="162" stroke="#485261" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="188" y1="162" x2="196" y2="162" stroke="#485261" strokeWidth="3.5" strokeLinecap="round" />

    {/* Lab Analyzer / Main Monitor (Angled drafting screen style) */}
    <g transform="translate(56, 42)">
      {/* Stand */}
      <rect x="54" y="72" width="16" height="15" rx="2" fill="#9995A6" />
      <ellipse cx="62" cy="87" rx="20" ry="4" fill="#C0CAD8" />
      {/* Screen Frame */}
      <rect x="12" y="6" width="100" height="68" rx="8" fill="#485261" stroke="#373F4D" strokeWidth="2" />
      {/* Screen Inner Display */}
      <rect x="16" y="10" width="92" height="60" rx="6" fill="#0B96C7" />
      
      {/* Screen UI - Clinical Chem Graph & Controls */}
      <rect x="22" y="16" width="40" height="20" rx="3" fill="#087CA5" />
      {/* Waveform / Curve */}
      <path d="M24 30 Q30 22 36 28 T48 20 T58 26" stroke="#DEE2E8" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Status dots */}
      <circle cx="28" cy="42" r="2" fill="#6BBADA" />
      <circle cx="36" cy="42" r="2" fill="#DEE2E8" />
      <circle cx="44" cy="42" r="2" fill="#C0CAD8" />
      {/* Sliders / controls */}
      <rect x="68" y="16" width="34" height="4" rx="2" fill="#087CA5" />
      <circle cx="86" cy="18" r="3.5" fill="#6BBADA" />
      <rect x="68" y="25" width="34" height="4" rx="2" fill="#087CA5" />
      <circle cx="76" cy="27" r="3.5" fill="#DEE2E8" />
      <rect x="68" y="34" width="34" height="4" rx="2" fill="#087CA5" />
      <circle cx="92" cy="36" r="3.5" fill="#F43F5E" />

      {/* Mini Diagnostic readouts */}
      <rect x="22" y="49" width="38" height="15" rx="3" fill="#087CA5" />
      <rect x="25" y="53" width="22" height="3" rx="1.5" fill="#6BBADA" />
      <rect x="25" y="58" width="15" height="2" rx="1" fill="#DEE2E8" />
      <rect x="64" y="49" width="38" height="15" rx="3" fill="#087CA5" />
      <rect x="67" y="53" width="18" height="3" rx="1.5" fill="#DEE2E8" />
      <rect x="67" y="58" width="26" height="2" rx="1" fill="#6BBADA" />
    </g>

    {/* Test Tube Rack on Desk */}
    <g transform="translate(48, 108)">
      <rect x="0" y="8" width="26" height="10" rx="2" fill="#C0CAD8" />
      {/* Tube 1: Red Top */}
      <rect x="3" y="0" width="5" height="14" rx="2.5" fill="#FDA4AF" />
      <rect x="2.5" y="0" width="6" height="3" rx="1" fill="#EF4444" />
      <rect x="3" y="6" width="5" height="8" rx="2" fill="#E11D48" />
      {/* Tube 2: Lavender Top (EDTA) */}
      <rect x="10" y="2" width="5" height="12" rx="2.5" fill="#E9D5FF" />
      <rect x="9.5" y="2" width="6" height="3" rx="1" fill="#9995A6" />
      <rect x="10" y="7" width="5" height="7" rx="2" fill="#7C778B" />
      {/* Tube 3: Sea Wonder Top */}
      <rect x="17" y="1" width="5" height="13" rx="2.5" fill="#BAE6FD" />
      <rect x="16.5" y="1" width="6" height="3" rx="1" fill="#0B96C7" />
      <rect x="17" y="6" width="5" height="8" rx="2" fill="#087CA5" />
    </g>

    {/* Potted Plant on Desk */}
    <g transform="translate(196, 108)">
      <path d="M3 10 L15 10 L13 18 L5 18 Z" fill="#C0CAD8" />
      <path d="M4 10 Q9 2 12 7 Q15 2 16 10 Z" fill="#6BBADA" />
      <circle cx="9" cy="6" r="4" fill="#0B96C7" />
    </g>

    {/* Lab Technologist Character sitting at desk */}
    <g transform="translate(160, 68)">
      {/* Ergonomic Chair Back */}
      <rect x="18" y="20" width="12" height="38" rx="6" fill="#0B96C7" />
      <rect x="22" y="58" width="4" height="24" fill="#9995A6" />
      {/* Chair base */}
      <path d="M12 82 L36 82" stroke="#485261" strokeWidth="3" strokeLinecap="round" />
      
      {/* Head & Hair */}
      <circle cx="2" cy="10" r="9" fill="#F87171" opacity="0.3" />
      <circle cx="0" cy="8" r="8" fill="#FDBA74" />
      <path d="M-6 6 C-6 -2 6 -3 8 4 C7 8 2 8 -6 6 Z" fill="#485261" />
      {/* Face profile / nose */}
      <path d="M-7 9 L-9 10 L-7 11 Z" fill="#FB923C" />
      {/* Headset / audio loop */}
      <path d="M-3 2 A 7 7 0 0 1 7 8" stroke="#6BBADA" strokeWidth="2" fill="none" />
      <circle cx="7" cy="9" r="2.5" fill="#0B96C7" />

      {/* Body / Clinical Scrub Coat */}
      <path d="M-8 20 C-10 16 12 16 10 20 L8 50 C2 52 -6 52 -8 50 Z" fill="#0B96C7" />
      {/* Arm extended to keyboard / analyzer */}
      <path d="M-6 24 L-22 36 L-32 38" stroke="#0B96C7" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="-32" cy="38" r="3.5" fill="#FDBA74" />
      {/* ID Badge on scrub */}
      <rect x="0" y="24" width="5" height="7" rx="1" fill="#FFFFFF" />
      <rect x="1" y="28" width="3" height="1.5" fill="#6BBADA" />
      {/* Pants & legs */}
      <path d="M-4 50 L-10 74 L-22 75" stroke="#485261" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="-26" y="73" width="9" height="5" rx="2" fill="#373F4D" />
    </g>

    {/* Floating Playful Accents (Matching Reference Image) */}
    {/* Paper Airplane */}
    <g transform="translate(62, 24) rotate(-12) scale(0.85)">
      <path d="M0 8 L18 0 L8 18 L6 10 Z" fill="#6BBADA" />
      <path d="M6 10 L18 0 L8 18 Z" fill="#0B96C7" opacity="0.5" />
    </g>
    {/* Chat / Alert Bubble */}
    <g transform="translate(198, 26) scale(0.9)">
      <circle cx="12" cy="12" r="12" fill="#DEE2E8" />
      <circle cx="8" cy="10" r="4" fill="#6BBADA" />
      <path d="M12 11 L18 17" stroke="#0B96C7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="15" r="2.5" fill="#0B96C7" />
      {/* Audio waves */}
      <path d="M22 6 Q25 9 22 12" stroke="#6BBADA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

// 2. Training Admin Illustration
const TrainingAdminIllustration = ({ isSelected }) => (
  <svg viewBox="0 0 260 180" className="w-full h-full max-h-[125px] sm:max-h-[135px] transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Subtle Floor Shadow */}
    <ellipse cx="130" cy="162" rx="95" ry="12" fill="#C0CAD8" fillOpacity="0.5" />

    {/* Office Desk */}
    <path d="M48 125 L212 125 L198 133 L62 133 Z" fill="#DEE2E8" />
    <rect x="54" y="128" width="152" height="5" rx="2.5" fill="#C0CAD8" />
    {/* Desk Legs */}
    <line x1="70" y1="133" x2="70" y2="162" stroke="#9995A6" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="190" y1="133" x2="190" y2="162" stroke="#9995A6" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="66" y1="162" x2="74" y2="162" stroke="#485261" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="186" y1="162" x2="194" y2="162" stroke="#485261" strokeWidth="3.5" strokeLinecap="round" />

    {/* Dual Admin Workstation Display */}
    <g transform="translate(132, 50)">
      {/* Stand */}
      <rect x="22" y="65" width="12" height="14" rx="2" fill="#9995A6" />
      <ellipse cx="28" cy="79" rx="16" ry="3.5" fill="#C0CAD8" />
      {/* Screen Frame */}
      <rect x="-8" y="4" width="72" height="62" rx="6" fill="#485261" stroke="#373F4D" strokeWidth="2" />
      {/* Inner Screen */}
      <rect x="-4" y="8" width="64" height="54" rx="4" fill="#0B96C7" />
      
      {/* Curriculum Analytics / Progress Bars */}
      <rect x="2" y="14" width="52" height="6" rx="2" fill="#087CA5" />
      <rect x="2" y="14" width="42" height="6" rx="2" fill="#6BBADA" />

      <rect x="2" y="23" width="52" height="6" rx="2" fill="#087CA5" />
      <rect x="2" y="23" width="28" height="6" rx="2" fill="#DEE2E8" />

      <rect x="2" y="32" width="52" height="6" rx="2" fill="#087CA5" />
      <rect x="2" y="32" width="48" height="6" rx="2" fill="#C0CAD8" />

      {/* Mini score card badge */}
      <rect x="2" y="42" width="24" height="14" rx="2" fill="#087CA5" />
      <circle cx="8" cy="49" r="3" fill="#FBBF24" />
      <rect x="14" y="48" width="9" height="2.5" rx="1" fill="#FFFFFF" />
      
      <rect x="30" y="42" width="24" height="14" rx="2" fill="#087CA5" />
      <circle cx="36" cy="49" r="3" fill="#6BBADA" />
      <rect x="42" y="48" width="9" height="2.5" rx="1" fill="#FFFFFF" />
    </g>

    {/* Secondary Monitor on Left Desk */}
    <g transform="translate(100, 66)">
      <rect x="0" y="0" width="32" height="48" rx="4" fill="#485261" />
      <rect x="2" y="2" width="28" height="44" rx="3" fill="#373F4D" />
      {/* Code / Checklist lines */}
      <line x1="6" y1="8" x2="22" y2="8" stroke="#6BBADA" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="14" x2="26" y2="14" stroke="#0B96C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="20" x2="18" y2="20" stroke="#DEE2E8" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="26" x2="24" y2="26" stroke="#C0CAD8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="31" x2="20" y2="31" stroke="#C0CAD8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="36" x2="16" y2="36" stroke="#6BBADA" strokeWidth="1.5" strokeLinecap="round" />
    </g>

    {/* Training Supervisor Character */}
    <g transform="translate(66, 68)">
      {/* Chair */}
      <rect x="2" y="20" width="12" height="38" rx="6" fill="#0B96C7" />
      <rect x="6" y="58" width="4" height="24" fill="#9995A6" />
      <path d="M-4 82 L20 82" stroke="#485261" strokeWidth="3" strokeLinecap="round" />

      {/* Head & Hair */}
      <circle cx="20" cy="8" r="8" fill="#FED7AA" />
      <path d="M12 6 C12 -3 28 -3 28 6 C26 9 20 8 12 6 Z" fill="#485261" />
      {/* Glasses */}
      <rect x="22" y="6" width="5" height="4" rx="1" stroke="#0B96C7" strokeWidth="1" fill="none" />
      
      {/* Professional Blazer */}
      <path d="M10 20 C8 16 30 16 28 20 L28 50 C20 52 14 52 10 50 Z" fill="#485261" />
      {/* Arm typing on keyboard */}
      <path d="M24 24 L38 34 L48 36" stroke="#485261" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="36" r="3.5" fill="#FED7AA" />

      {/* Pants & legs */}
      <path d="M18 50 L24 74 L36 75" stroke="#373F4D" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="34" y="73" width="9" height="5" rx="2" fill="#202630" />
    </g>

    {/* Desk Accessories */}
    {/* Potted desk plant */}
    <g transform="translate(202, 108)">
      <path d="M2 10 L14 10 L12 18 L4 18 Z" fill="#C0CAD8" />
      <circle cx="8" cy="6" r="5" fill="#6BBADA" />
      <circle cx="11" cy="4" r="3" fill="#0B96C7" />
    </g>

    {/* Floating Badges */}
    <g transform="translate(56, 32)">
      <rect x="0" y="0" width="28" height="12" rx="3" fill="#485261" />
      <text x="5" y="9" fill="#6BBADA" fontSize="7" fontWeight="bold" fontFamily="monospace">SOP</text>
    </g>
    <g transform="translate(56, 48)">
      <rect x="0" y="0" width="28" height="12" rx="3" fill="#485261" />
      <text x="6" y="9" fill="#DEE2E8" fontSize="7" fontWeight="bold" fontFamily="monospace">LMS</text>
    </g>
    <g transform="translate(56, 64)">
      <rect x="0" y="0" width="28" height="12" rx="3" fill="#485261" />
      <text x="5" y="9" fill="#C0CAD8" fontSize="7" fontWeight="bold" fontFamily="monospace">QC</text>
    </g>

    {/* Floating Graduation / Certificate Accent */}
    <g transform="translate(198, 28) scale(0.85)">
      {/* Graduation Cap */}
      <polygon points="14,2 26,8 14,14 2,8" fill="#485261" />
      <path d="M6 10.5 L6 16 C6 18 22 18 22 16 L22 10.5" fill="#0B96C7" />
      <circle cx="14" cy="8" r="1.5" fill="#FBBF24" />
      <path d="M14 8 L24 13" stroke="#FBBF24" strokeWidth="1" />
    </g>
  </svg>
);

// 3. System Admin Illustration
const SystemAdminIllustration = ({ isSelected }) => (
  <svg viewBox="0 0 260 180" className="w-full h-full max-h-[125px] sm:max-h-[135px] transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Subtle Floor Shadow */}
    <ellipse cx="130" cy="162" rx="95" ry="12" fill="#C0CAD8" fillOpacity="0.5" />

    {/* IT Operations Desk */}
    <path d="M46 125 L214 125 L200 133 L60 133 Z" fill="#DEE2E8" />
    <rect x="52" y="128" width="156" height="5" rx="2.5" fill="#C0CAD8" />
    {/* Desk Legs */}
    <line x1="68" y1="133" x2="68" y2="162" stroke="#9995A6" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="192" y1="133" x2="192" y2="162" stroke="#9995A6" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="64" y1="162" x2="72" y2="162" stroke="#485261" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="188" y1="162" x2="196" y2="162" stroke="#485261" strokeWidth="3.5" strokeLinecap="round" />

    {/* Multi-Monitor Command Center (Main Screen) */}
    <g transform="translate(136, 48)">
      <rect x="20" y="66" width="12" height="13" rx="2" fill="#9995A6" />
      <ellipse cx="26" cy="79" rx="16" ry="3.5" fill="#C0CAD8" />
      {/* Main Wide Monitor */}
      <rect x="-10" y="4" width="72" height="62" rx="6" fill="#485261" stroke="#373F4D" strokeWidth="2" />
      <rect x="-6" y="8" width="64" height="54" rx="4" fill="#0B96C7" />

      {/* Network Nodes / Server Status */}
      <circle cx="8" cy="20" r="4" fill="#DEE2E8" />
      <circle cx="26" cy="20" r="4" fill="#6BBADA" />
      <circle cx="44" cy="20" r="4" fill="#DEE2E8" />
      <line x1="12" y1="20" x2="22" y2="20" stroke="#DEE2E8" strokeWidth="1.5" />
      <line x1="30" y1="20" x2="40" y2="20" stroke="#6BBADA" strokeWidth="1.5" />

      {/* Telemetry Chart */}
      <path d="M-2 42 L8 36 L18 40 L28 30 L38 34 L52 26" stroke="#DEE2E8" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Code Blocks */}
      <rect x="-2" y="48" width="22" height="8" rx="2" fill="#087CA5" />
      <text x="0" y="54" fill="#DEE2E8" fontSize="5" fontFamily="monospace">&lt;LIMS/&gt;</text>
      <rect x="24" y="48" width="28" height="8" rx="2" fill="#087CA5" />
      <text x="26" y="54" fill="#6BBADA" fontSize="5" fontFamily="monospace">API:200</text>
    </g>

    {/* Secondary Vertical Monitor */}
    <g transform="translate(106, 62)">
      <rect x="0" y="0" width="24" height="52" rx="4" fill="#485261" />
      <rect x="2" y="2" width="20" height="48" rx="3" fill="#373F4D" />
      {/* Terminal log lines */}
      <line x1="5" y1="8" x2="15" y2="8" stroke="#6BBADA" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="13" x2="19" y2="13" stroke="#DEE2E8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="18" x2="13" y2="18" stroke="#0B96C7" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="23" x2="17" y2="23" stroke="#C0CAD8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="28" x2="15" y2="28" stroke="#C0CAD8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="33" x2="18" y2="33" stroke="#6BBADA" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="38" x2="12" y2="38" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="43" x2="16" y2="43" stroke="#DEE2E8" strokeWidth="1.2" strokeLinecap="round" />
    </g>

    {/* Mini Server Tower next to desk */}
    <g transform="translate(204, 95)">
      <rect x="0" y="0" width="18" height="36" rx="3" fill="#485261" stroke="#373F4D" strokeWidth="1" />
      {/* Drive bays with blinking LED lights */}
      <rect x="3" y="4" width="12" height="5" rx="1" fill="#373F4D" />
      <circle cx="12" cy="6.5" r="1" fill="#6BBADA" />
      <rect x="3" y="11" width="12" height="5" rx="1" fill="#373F4D" />
      <circle cx="12" cy="13.5" r="1" fill="#0B96C7" />
      <rect x="3" y="18" width="12" height="5" rx="1" fill="#373F4D" />
      <circle cx="12" cy="20.5" r="1" fill="#DEE2E8" />
      <rect x="3" y="25" width="12" height="5" rx="1" fill="#373F4D" />
      <circle cx="12" cy="27.5" r="1" fill="#6BBADA" />
    </g>

    {/* System Administrator Character */}
    <g transform="translate(68, 68)">
      {/* IT Ergonomic Chair */}
      <rect x="2" y="20" width="12" height="38" rx="6" fill="#0B96C7" />
      <rect x="6" y="58" width="4" height="24" fill="#9995A6" />
      <path d="M-4 82 L20 82" stroke="#485261" strokeWidth="3" strokeLinecap="round" />

      {/* Head & Hair */}
      <circle cx="20" cy="8" r="8" fill="#FBCFE8" />
      <path d="M12 6 C12 -4 28 -4 28 6 C28 9 20 8 12 6 Z" fill="#485261" />
      {/* Headphone band */}
      <path d="M14 6 A 6 6 0 0 1 26 6" stroke="#6BBADA" strokeWidth="2" fill="none" />
      <circle cx="13" cy="7" r="2.5" fill="#0B96C7" />

      {/* Tech Polo / Hoodie */}
      <path d="M10 20 C8 16 30 16 28 20 L28 50 C20 52 14 52 10 50 Z" fill="#485261" />
      {/* Arm typing on keyboard */}
      <path d="M24 24 L38 34 L48 36" stroke="#485261" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="36" r="3.5" fill="#FBCFE8" />

      {/* Pants & legs */}
      <path d="M18 50 L24 74 L36 75" stroke="#373F4D" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="34" y="73" width="9" height="5" rx="2" fill="#202630" />
    </g>

    {/* Floating IT / Cloud / Security Badges */}
    {/* Floating Security Shield */}
    <g transform="translate(52, 28) scale(0.9)">
      <path d="M10 2 L18 6 V12 C18 17 10 21 10 21 C10 21 2 17 2 12 V6 Z" fill="#0B96C7" />
      <circle cx="10" cy="10" r="2" fill="#FFFFFF" />
      <rect x="9" y="11" width="2" height="3" fill="#FFFFFF" />
    </g>

    {/* Floating Database Icon */}
    <g transform="translate(54, 52) scale(0.85)">
      <rect x="0" y="0" width="18" height="6" rx="3" fill="#485261" stroke="#6BBADA" strokeWidth="1" />
      <rect x="0" y="8" width="18" height="6" rx="3" fill="#485261" stroke="#6BBADA" strokeWidth="1" />
      <rect x="0" y="16" width="18" height="6" rx="3" fill="#485261" stroke="#6BBADA" strokeWidth="1" />
      <circle cx="4" cy="3" r="1" fill="#DEE2E8" />
      <circle cx="4" cy="11" r="1" fill="#DEE2E8" />
      <circle cx="4" cy="19" r="1" fill="#DEE2E8" />
    </g>

    {/* Floating Cloud Sync Icon */}
    <g transform="translate(196, 26) scale(0.85)">
      <path d="M18 14 C21 14 23 12 23 9 C23 6 20 4.5 18 5 C17 2 13 1 10 3 C7 1 3 3 3 7 C1 8 0 10 0 12 C0 15 2.5 17 6 17 H18 Z" fill="#6BBADA" opacity="0.9" />
      {/* Download / Sync Arrow */}
      <path d="M11 9 V14 M8 12 L11 15 L14 12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

/* ============================================================
   Main Role Selection Screen Component
   Styling harmonized with LabCertify Clinical Theme:
   #DEE2E8 (Bleached White)
   #C0CAD8 (Icy Brook)
   #6BBADA (Bluebrite)
   #9995A6 (Lavender Ash)
   #0B96C7 (Sea Wonder)
   #485261 (Senate)
   ============================================================ */
export const RoleSelectionView = ({ 
  selectedRole = 'trainee', 
  onSelectRole, 
  onConfirmRole,
  onOpenSupport
}) => {
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { toggleTheme, isDark } = useTheme();

  // Internal active tab in card header (Home, About, Services, Contact)
  const [activeHeaderTab, setActiveHeaderTab] = useState('Home');
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);

  // Active step / pagination dot (Step 2 is active by default as shown in the screenshot)
  const [activeStep, setActiveStep] = useState(2);

  const roles = [
    {
      id: 'trainee',
      title: isRTL ? 'أخصائي تحاليل متدرب' : 'Medical Trainee',
      roleEnglish: 'Medical Trainee',
      persona: mockPersonas.trainee,
      subBadge: isRTL ? 'الكيمياء الإكلينيكية وأمراض الدم' : 'Clinical Laboratory Technologist',
      illustration: MedicalTraineeIllustration,
      stats: isRTL ? 'المسار الإلزامي: 5 مقررات' : 'Mandatory Path: 5 Courses'
    },
    {
      id: 'training_admin',
      title: isRTL ? 'مسؤول التدريب والتطوير' : 'Training Admin',
      roleEnglish: 'Training Admin',
      persona: mockPersonas.training_admin,
      subBadge: isRTL ? 'التعليم الإكلينيكي وتدريب الجودة' : 'Education & Quality Supervisor',
      illustration: TrainingAdminIllustration,
      stats: isRTL ? 'إشراف المتدربين واعتماد الشهادات' : 'Curriculum & Certification Audit'
    },
    {
      id: 'system_admin',
      title: isRTL ? 'مسؤول النظام والتقنية' : 'System Admin',
      roleEnglish: 'System Admin',
      persona: mockPersonas.system_admin,
      subBadge: isRTL ? 'إدارة نظم LIMS والبنية التقنية' : 'LIMS & Platform Governance',
      illustration: SystemAdminIllustration,
      stats: isRTL ? 'حوكمة النظام والربط الشبكي Odoo' : 'LIMS v19 & Access Security'
    }
  ];

  const handleCardClick = (roleId) => {
    if (onSelectRole) {
      onSelectRole(roleId);
    }
  };

  const handleNextClick = () => {
    if (onConfirmRole) {
      onConfirmRole(selectedRole);
    }
  };

  const handleNavClick = (tab) => {
    setActiveHeaderTab(tab);
    if (tab === 'About') {
      setShowAboutModal(true);
    } else if (tab === 'Services') {
      setShowServicesModal(true);
    } else if (tab === 'Contact') {
      if (onOpenSupport) {
        onOpenSupport();
      }
    }
  };

  return (
    <div className="h-screen max-h-screen w-full bg-[#DEE2E8] bg-gradient-to-br from-[#cdd8e6] via-[#DEE2E8] to-[#b8cadf] flex items-center justify-center p-3 sm:p-5 select-none relative overflow-hidden">
      
      {/* Ambient background soft glow effects matching palette */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6BBADA]/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0B96C7]/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Main Floating Card: 850px width & shorter length, floating centered without scrolling */}
      <div className="w-full max-w-[850px] max-h-[calc(100vh-28px)] bg-white dark:bg-[#1a2333] rounded-[26px] sm:rounded-[30px] shadow-[0_20px_50px_rgba(72,82,97,0.16)] border border-[#C0CAD8] dark:border-gray-800 p-4 sm:p-5 md:p-6 relative z-10 transition-all duration-300 flex flex-col justify-between overflow-hidden my-auto">
        
        {/* ========================================================
            Card Top Bar: Official LabCertify Logo (Left) & Shalaby Labs Logo (Right)
           ======================================================== */}
        <header className="flex items-center justify-between pb-3 sm:pb-3.5 border-b border-[#C0CAD8]/60 dark:border-gray-800/80">
          
          {/* Official Brand Logo & Name */}
          <div className="cursor-pointer group hover:opacity-95 transition-opacity" onClick={() => setShowAboutModal(true)}>
            <LabCertifyLogo 
              iconSize="w-8 h-8 sm:w-8.5 sm:h-8.5" 
              textSize="text-[19px] sm:text-[21px]" 
            />
          </div>

          {/* Right Navigation Menu - Language & Theme Controls */}
          <nav className="flex items-center gap-2">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={toggleLanguage}
                title={language === 'en' ? 'التحويل للعربية' : 'Switch to English'}
                className="p-1 rounded-md text-[#485261] hover:text-[#0B96C7] hover:bg-[#DEE2E8]/60 dark:hover:bg-gray-800 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#0B96C7]" />
                <span className="text-[11px] uppercase">{language === 'en' ? 'AR' : 'EN'}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Light Mode' : 'Dark Mode'}
                className="p-1 rounded-md text-[#485261] hover:text-[#0B96C7] hover:bg-[#DEE2E8]/60 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#0B96C7]" />}
              </button>
            </div>
          </nav>

        </header>

        {/* ========================================================
            Card Center Heading & Subtitle
           ======================================================== */}
        <div className="text-center mt-3 sm:mt-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[#485261] dark:text-white tracking-tight font-heading">
            {t.selectRoleTitle || 'Select your role'}
          </h1>
          <p className="text-xs text-[#9995A6] dark:text-[#C0CAD8] mt-1 max-w-md mx-auto">
            {t.selectRoleSubtitle || 'To start your project we need to customize your preferences.'}
          </p>
        </div>

        {/* ========================================================
            3 Roles Cards Grid (Compact & Perfectly Balanced)
           ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-3.5 sm:mt-4">
          {roles.map((item) => {
            const isSelected = selectedRole === item.id;
            const Illustration = item.illustration;

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                onDoubleClick={handleNextClick}
                className={`group rounded-xl p-3 sm:p-3.5 flex flex-col items-center justify-between cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'border-2 border-[#0B96C7] bg-white dark:bg-[#1f2a3d] shadow-[0_8px_24px_rgba(11,150,199,0.16)] ring-2 ring-[#0B96C7]/15 -translate-y-0.5'
                    : 'border border-[#C0CAD8] dark:border-gray-700/80 hover:border-[#6BBADA] dark:hover:border-gray-600 bg-white dark:bg-[#1a2333] hover:-translate-y-0.5 hover:shadow-xs'
                }`}
              >
                {/* Top Illustration Area */}
                <div className="w-full h-24 sm:h-28 flex items-center justify-center p-0.5">
                  <Illustration isSelected={isSelected} />
                </div>

                {/* Bottom Role Title */}
                <div className="text-center mt-2 w-full">
                  <h3 className={`text-sm sm:text-base font-bold transition-colors ${
                    isSelected 
                      ? 'text-[#0B96C7]' 
                      : 'text-[#485261] dark:text-gray-100 group-hover:text-[#0B96C7]'
                  }`}>
                    {item.title}
                  </h3>

                  {/* Subtle Subtitle / Persona summary */}
                  <p className="text-[10px] sm:text-[11px] text-[#9995A6] dark:text-[#C0CAD8] mt-0.5 truncate">
                    {item.subBadge}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            Pagination / Progress Dots (4 dots, 2nd active in Sea Wonder)
           ======================================================== */}
        <div className="flex items-center justify-center gap-1.5 mt-3 sm:mt-4">
          {[1, 2, 3, 4].map((step) => {
            const isActive = activeStep === step;
            return (
              <button
                key={step}
                type="button"
                onClick={() => setActiveStep(step)}
                className={`transition-all duration-200 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-2 h-2 bg-[#0B96C7] ring-3 ring-[#0B96C7]/20 scale-110'
                    : 'w-1.5 h-1.5 bg-[#C0CAD8] dark:bg-gray-700 hover:bg-[#9995A6]'
                }`}
                aria-label={`Step ${step}`}
              />
            );
          })}
        </div>

        {/* ========================================================
            Next Action Button (Compact Sea Wonder Primary CTA)
           ======================================================== */}
        <div className="flex justify-center mt-3 sm:mt-4">
          <button
            type="button"
            onClick={handleNextClick}
            className="px-8 sm:px-11 py-2 sm:py-2.5 bg-[#0B96C7] hover:bg-[#0983ad] active:bg-[#087399] text-white font-bold text-xs sm:text-sm rounded-lg shadow-md shadow-[#0B96C7]/30 hover:shadow-[#0B96C7]/45 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t.btnNext || 'Next'}</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* ========================================================
          About Shalaby Labs Modal (Triggered by 'About' in header)
         ======================================================== */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#1a2333] rounded-2xl p-6 shadow-2xl border border-[#C0CAD8] dark:border-gray-800">
            <div className="flex items-center justify-between pb-3 border-b border-[#C0CAD8]/60 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#0B96C7]" />
                <h3 className="font-bold text-base text-[#485261] dark:text-white">
                  {isRTL ? 'عن معامل شلبي ونظام LabCertify' : 'About Shalaby Labs & LabCertify'}
                </h3>
              </div>
              <button 
                onClick={() => setShowAboutModal(false)}
                className="p-1 rounded-lg text-[#9995A6] hover:text-[#485261] dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-[#485261] dark:text-gray-300 leading-relaxed">
              <p>
                {isRTL 
                  ? 'يعد نظام LabCertify Clinical LMS المنظومة التوجيهية والتدريبية المعتمدة لكوادر معامل شلبي للتحاليل الطبية وفق أعلى المعايير الدولية ISO 15189 و CAP.'
                  : 'LabCertify Clinical LMS is the official orientation and competency management platform for Shalaby Laboratories clinical personnel, aligned with ISO 15189 and CAP clinical quality standards.'}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-[#DEE2E8]/60 dark:bg-gray-800 border border-[#C0CAD8] text-[#485261] dark:text-[#C0CAD8]">
                  <span className="font-bold block text-xs text-[#0B96C7]">5 Sequential Courses</span>
                  <span className="text-[11px] opacity-80">Mandatory curriculum</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#DEE2E8]/60 dark:bg-gray-800 border border-[#C0CAD8] text-[#485261] dark:text-[#C0CAD8]">
                  <span className="font-bold block text-xs text-[#0B96C7]">QR Verified Certs</span>
                  <span className="text-[11px] opacity-80">Official credentials</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-5 py-2 bg-[#485261] hover:bg-[#373F4D] text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          Services Modal (Triggered by 'Services' in header)
         ======================================================== */}
      {showServicesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#1a2333] rounded-2xl p-6 shadow-2xl border border-[#C0CAD8] dark:border-gray-800">
            <div className="flex items-center justify-between pb-3 border-b border-[#C0CAD8]/60 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-5 h-5 text-[#0B96C7]" />
                <h3 className="font-bold text-base text-[#485261] dark:text-white">
                  {isRTL ? 'الخدمات والمسارات المخبرية المعتمدة' : 'Accredited Laboratory Modules'}
                </h3>
              </div>
              <button 
                onClick={() => setShowServicesModal(false)}
                className="p-1 rounded-lg text-[#9995A6] hover:text-[#485261] dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-[#485261] dark:text-gray-300">
              {[
                { title: '1. Laboratory Orientation & Code of Conduct', badge: 'Mandatory' },
                { title: '2. Biosafety, Hazard Waste & Chemical Hygiene', badge: 'Active' },
                { title: '3. Pre-Analytical Phase: Specimen Integrity', badge: 'Sequential' },
                { title: '4. Quality Control & Calibration Standards', badge: 'Sequential' },
                { title: '5. Supervisory Leadership & Laboratory Audit', badge: 'Capstone' },
              ].map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#DEE2E8]/40 dark:bg-gray-800/60 border border-[#C0CAD8] dark:border-gray-700/50">
                  <span className="font-medium text-[#485261] dark:text-gray-200">{m.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 text-[#0B96C7] border border-[#C0CAD8]">
                    {m.badge}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowServicesModal(false)}
                className="px-5 py-2 bg-[#0B96C7] hover:bg-[#0983ad] text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                {isRTL ? 'حسناً' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
