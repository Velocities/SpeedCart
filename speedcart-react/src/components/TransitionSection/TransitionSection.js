import React from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './TransitionSection.module.css';

const TransitionSection = (props) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    rootMargin: '-50% 0px', // Adjust the percentage as needed
    // Additional options if needed
  });

  // Join the classes into a single string
  const showClasses = props.showClasses ? props.showClasses.join(' ') : '';
  const hiddenClasses = props.hiddenClasses ? props.hiddenClasses.join(' ') : '';

  return (
    <section 
      className={`${styles.transitionSection} ${inView ? showClasses : hiddenClasses} ${props.additionalClasses}`} 
      ref={ref} 
      id={props.id}
    >
      {props.children}
    </section>
  );
};

export default TransitionSection;
