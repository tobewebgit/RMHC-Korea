export function initSvgLineReveal({
  sectionSelector,
  groupSelector,
  lineSelector,
  duration = 0.9,
  delayStep = 0.9,
  totalDuration = null,
  threshold = 0.2,
  offsetAdjustment = 20,
  observeGroups = false,
}) {
  const section = document.querySelector(sectionSelector);
  const groups = section ? Array.from(section.querySelectorAll(groupSelector)) : [];
  const lines = section ? Array.from(section.querySelectorAll(lineSelector)) : [];
  if (!section || groups.length === 0 || lines.length === 0) return;

  const activeAnimationsByTarget = new Map();

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

  const cancelAnimations = (target = null) => {
    const targets = target ? [target] : Array.from(activeAnimationsByTarget.keys());

    targets.forEach((currentTarget) => {
      const activeAnimations = activeAnimationsByTarget.get(currentTarget) || [];
      activeAnimations.forEach((animation) => {
        if (animation && typeof animation.kill === 'function') {
          animation.kill();
          return;
        }

        if (animation && typeof animation.cancel === 'function') {
          animation.cancel();
        }
      });
      activeAnimationsByTarget.delete(currentTarget);
    });
  };

  const setLineStart = (line) => {
    const { drawLength, hiddenLength, hiddenOffset } = getDrawMetrics(line);
    line.style.transition = '';
    line.style.strokeDasharray = `${drawLength} ${hiddenLength}`;
    line.style.strokeDashoffset = hiddenOffset;
    line.style.opacity = '0';
  };

  const getTargetGroups = (target) => (target ? [target] : groups);

  const reset = (target = null) => {
    cancelAnimations(target);
    getTargetGroups(target).forEach((group) => {
      group.querySelectorAll(lineSelector).forEach(setLineStart);
    });
  };

  const fadeOut = (target = null) => {
    cancelAnimations(target);
    const targetLines = getTargetGroups(target).flatMap((group) =>
      Array.from(group.querySelectorAll(lineSelector)),
    );

    if (window.gsap) {
      const tween = gsap.to(targetLines, {
        opacity: 0,
        duration: 0.5,
        ease: 'power1.in',
        onComplete: () => {
          targetLines.forEach(setLineStart);
        },
      });
      activeAnimationsByTarget.set(target || section, [tween]);
      return;
    }

    // GSAP 없을 때: CSS transition으로 페이드아웃
    targetLines.forEach((line) => {
      line.style.transition = 'opacity 0.45s ease';
      line.style.opacity = '0';
    });
    const fadeOutTimer = setTimeout(() => {
      targetLines.forEach((line) => {
        line.style.transition = '';
        setLineStart(line);
      });
    }, 480);
    activeAnimationsByTarget.set(target || section, [
      { cancel: () => clearTimeout(fadeOutTimer) },
    ]);
  };

  const drawLine = (line, delay, lineDuration, target) => {
    const animationList = activeAnimationsByTarget.get(target) || [];

    if (window.gsap) {
      const tween = gsap.to(line, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: lineDuration,
        delay,
        ease: 'none',
      });
      animationList.push(tween);
      activeAnimationsByTarget.set(target, animationList);
      return;
    }

    const animation = line.animate(
      [
        { strokeDashoffset: getComputedStyle(line).strokeDashoffset, opacity: 0 },
        { strokeDashoffset: '0', opacity: 1 },
      ],
      {
        duration: lineDuration * 1000,
        delay: delay * 1000,
        easing: 'linear',
        fill: 'forwards',
      },
    );
    animationList.push(animation);
    activeAnimationsByTarget.set(target, animationList);
  };

  const play = (target = null) => {
    reset(target);
    getTargetGroups(target).forEach((group) => {
      const groupLines = Array.from(group.querySelectorAll(lineSelector));
      const n = groupLines.length;
      if (n === 0) return;
      
      let calcDuration = duration;
      let calcDelayStep = delayStep;

      if (totalDuration !== null) {
        calcDuration = totalDuration / n;
        calcDelayStep = totalDuration / n;
      }

      groupLines.forEach((line, index) => {
        drawLine(line, index * calcDelayStep, calcDuration, target || section);
      });
    });
  };

  reset();

  if (!('IntersectionObserver' in window)) {
    play();
    return;
  }

  const visibleTargets = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = observeGroups ? entry.target : null;
        const targetKey = target || section;

        if (entry.isIntersecting) {
          if (visibleTargets.has(targetKey)) return;
          visibleTargets.add(targetKey);
          play(target);
          return;
        }

        if (!visibleTargets.has(targetKey)) return;
        visibleTargets.delete(targetKey);
        fadeOut(target);
      });
    },
    { threshold },
  );

  (observeGroups ? groups : [section]).forEach((target) => observer.observe(target));
}
