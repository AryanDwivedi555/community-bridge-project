import { useNeuralTranslation } from '@/hooks/useNeuralTranslation';
import React from 'react';

interface TProps {
  // We keep ReactNode here so you can use it in JSX, 
  // but we will filter it inside the component.
  children: React.ReactNode;
}

export const T = ({ children }: TProps) => {
  // 1. Convert children to string safely
  // If it's a string/number, use it. If it's an object/array, default to empty string.
  const textToProcess = (typeof children === 'string' || typeof children === 'number') 
    ? children.toString() 
    : "";

  // 2. Call your existing neural hook with the safe string
  const translated = useNeuralTranslation(textToProcess);

  // 3. Return the translated text
  return <>{translated}</>;
};