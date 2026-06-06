import { useState, useEffect } from 'react';

/**
 * Advanced Device Fingerprinting Engine
 * 
 * Cryptographically hashes hardware capabilities, Canvas drawing output, 
 * WebGL renderer info, and OS specifics to create an immutable device signature.
 * Used for Zero-Trust session validation.
 */

// Simple fast hash function (cyrb53)
const hashString = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const useDeviceFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [fingerprintDetails, setFingerprintDetails] = useState<any>(null);

  useEffect(() => {
    const generateFingerprint = async () => {
      // 1. Hardware Concurrency & Memory
      const cores = navigator.hardwareConcurrency || 'unknown';
      const memory = (navigator as any).deviceMemory || 'unknown';
      
      // 2. Screen details (color depth, pixel ratio)
      const screenDetails = `${window.screen.colorDepth}:${window.screen.pixelDepth}:${window.devicePixelRatio}`;
      
      // 3. Timezone & Language
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = navigator.language;

      // 4. Canvas Fingerprinting (draws a complex shape and extracts data URL)
      const getCanvasData = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return 'no-canvas';
          
          canvas.width = 200;
          canvas.height = 50;
          ctx.textBaseline = "top";
          ctx.font = "14px 'Arial'";
          ctx.textBaseline = "alphabetic";
          ctx.fillStyle = "#f60";
          ctx.fillRect(125,1,62,20);
          ctx.fillStyle = "#069";
          ctx.fillText("TrustVault.Security", 2, 15);
          ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
          ctx.fillText("TrustVault.Security", 4, 17);
          return canvas.toDataURL();
        } catch (e) {
          return 'canvas-error';
        }
      };

      // 5. WebGL Vendor & Renderer
      const getWebGLData = () => {
        try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (!gl) return 'no-webgl';
          const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
          if (!debugInfo) return 'no-webgl-debug';
          return `${(gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)}~${(gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}`;
        } catch (e) {
          return 'webgl-error';
        }
      };

      const canvasHash = hashString(getCanvasData()).toString(16);
      const webGLData = getWebGLData();
      
      const rawString = `${cores}|${memory}|${screenDetails}|${timezone}|${language}|${canvasHash}|${webGLData}`;
      const finalHash = `tv_${hashString(rawString).toString(16).padStart(16, '0')}`;

      setFingerprintDetails({
        cores,
        memory,
        timezone,
        canvasHash,
        webGLData,
        rawString
      });
      
      setFingerprint(finalHash);
    };

    generateFingerprint();
  }, []);

  return { fingerprint, fingerprintDetails };
};
