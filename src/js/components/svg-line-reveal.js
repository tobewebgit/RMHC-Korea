export function initSvgLineReveal({
  sectionSelector,
  groupSelector,
  lineSelector,
  duration = 0.9,
  delayStep = 0.9,
  threshold = 0.2,
  offsetAdjustment = 20,
}) {
  const section = document.querySelector(sectionSelector);
  const groups = section ? Array.from(section.querySelectorAll(groupSelector)) : [];
  const lines = section ? Array.from(section.querySelectorAll(lineSelector)) : [];
  if (!section || groups.length === 0 || lines.length === 0) return;

  let activeAnimations = [];

  const getDrawMetrics = (line) => {
    const pathLength = line.getTotalLength();
    const drawRatio = Math.min(Math.max(Number(line.dataset.drawRatio || 1), 0), 1);
    const drawLength = pathLength * drawRatio;

    return {
      drawLength,
      hiddenLength: pathLength + offsetAdjustment,
      hiddenOffset: drawLength + offsetAdjustment,
    };
  };

  const cancelAnimations = () => {
    activeAnimations.forEach((animation) => {
      if (animation && typeof animation.kill === 'function') {
        animation.kill();
        return;
      }

      if (animation && typeof animation.cancel === 'function') {
        animation.cancel();
      }
    });
    activeAnimations = [];
  };

  const setLineStart = (line) => {
    const { drawLength, hiddenLength, hiddenOffset } = getDrawMetrics(line);
    line.style.strokeDasharray = `${drawLength} ${hiddenLength}`;
    line.style.strokeDashoffset = hiddenOffset;
    line.style.opacity = '0';
  };

  const reset = () => {
    cancelAnimations();
    lines.forEach(setLineStart);
  };

  const fadeOut = () => {
    cancelAnimations();

    if (window.gsap) {
      const tween = gsap.to(lines, {
        opacity: 0,
        duration: 0.5,
        ease: 'power1.in',
        onComplete: () => {
          lines.forEach(setLineStart);
        },
      });
      activeAnimations.push(tween);
      return;
    }

    // GSAP 없을 때: CSS transition으로 페이드아웃
    lines.forEach((line) => {
      line.style.transition = 'opacity 0.45s ease';
      line.style.opacity = '0';
    });
    setTimeout(() => {
      lines.forEach((line) => {
        line.style.transition = '';
        setLineStart(line);
      });
    }, 480);
  };

  const drawLine = (line, delay) => {
    if (window.gsap) {
      const tween = gsap.to(line, {
        strokeDashoffset: 0,
        opacity: 1,
        duration,
        delay,
        ease: 'none',
      });
      activeAnimations.push(tween);
      return;
    }

    const animation = line.animate(
      [
        { strokeDashoffset: getComputedStyle(line).strokeDashoffset, opacity: 0 },
        { strokeDashoffset: '0', opacity: 1 },
      ],
      {
        duration: duration * 1000,
        delay: delay * 1000,
        easing: 'linear',
        fill: 'forwards',
      },
    );
    activeAnimations.push(animation);
  };

  const play = () => {
    reset();
    groups.forEach((group) => {
      Array.from(group.querySelectorAll(lineSelector)).forEach((line, index) => {
        drawLine(line, index * delayStep);
      });
    });
  };

  reset();

  if (!('IntersectionObserver' in window)) {
    play();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          play();
          return;
        }

        fadeOut();
      });
    },
    { threshold },
  );

  observer.observe(section);
}
