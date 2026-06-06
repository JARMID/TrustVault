import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';

/**
 * ContainerScroll — 3D perspective scroll animation
 * Adapted from scroll.md reference (Aceternity pattern).
 * Shows a dashboard preview rotating into view as user scrolls.
 */
export const ContainerScroll: React.FC<{
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}> = ({ titleComponent, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      style={{
        height: isMobile ? '60rem' : '80rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: isMobile ? '8px' : '80px',
      }}
    >
      <div
        style={{
          padding: isMobile ? '40px 0' : '160px 0',
          width: '100%',
          position: 'relative',
          perspective: '1000px',
        }}
      >
        <ScrollHeader translate={translate} titleComponent={titleComponent} />
        <ScrollCard rotate={rotate} translate={translate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  );
};

const ScrollHeader: React.FC<{
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}> = ({ translate, titleComponent }) => (
  <motion.div
    style={{ translateY: translate, maxWidth: '64rem', margin: '0 auto', textAlign: 'center' }}
  >
    {titleComponent}
  </motion.div>
);

const ScrollCard: React.FC<{
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}> = ({ rotate, scale, children }) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow:
        '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      maxWidth: '64rem',
      marginTop: '-48px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      border: '2px solid rgba(0, 198, 174, 0.15)',
      padding: '8px',
      background: 'linear-gradient(135deg, #0D1220 0%, #131A2E 100%)',
      borderRadius: '24px',
    }}
  >
    <div
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        background: '#070B14',
        minHeight: '30rem',
      }}
    >
      {children}
    </div>
  </motion.div>
);

export default ContainerScroll;



