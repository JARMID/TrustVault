'use client';

import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

/**
 * Lazy-loaded Spline 3D scene wrapper with a skeleton loader fallback.
 * Used to render interactive 3D scenes from spline.design without blocking the main bundle.
 */
export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '2px solid rgba(0,198,174,0.15)',
              borderTopColor: 'var(--vault-primary, #00C6AE)',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}



