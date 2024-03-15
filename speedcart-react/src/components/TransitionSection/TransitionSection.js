import React from 'react';
import { useInView } from 'react-intersection-observer';
import './TransitionSection.css';

const TransitionSection = (props) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    rootMargin: '-50% 0px', // Adjust the percentage as needed
    // Additional options if needed
  });

  return (
    <section className={`transitionSection ${inView ? 'show' : 'hidden'} ${props.additionalClasses}`} ref={ref} id={props.id}>
      {React.Children.map(props.children, (child) =>
        React.cloneElement(child, {
          className: `element ${child.props.className || ''} ${inView ? 'show' : 'hidden'}`,
        })
      )}
    </section>
  );
};

export default TransitionSection;
