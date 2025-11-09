
import  { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Loader = () => {
  const dotsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });

    tl.to(dotsRef.current, {
      y: -20,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power1.inOut',
    }).to(dotsRef.current, {
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'bounce.out',
    });

    return () => tl.kill();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex space-x-4">
        {[0, 1, 2].map((_, index) => (
          <div
            key={index}
            ref={(el) => (dotsRef.current[index] = el)}
            className="w-5 h-5 rounded-full bg-[#46AA72]"
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
