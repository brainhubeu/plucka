import { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

export const useSmartEffect = (
  cb: (previousDependencies: any[]) => void | (() => void),
  dependencies: any[],
  actualDependencies: any[],
) => {
  const initialRenderRef = useRef(true);
  const refActualDependencies = useRef<any[]>([]);
  useEffect(() => {
    const changed = actualDependencies.some(
      (actualDependency, index) =>
        actualDependency !== refActualDependencies.current[index],
    );
    if (changed || (!actualDependencies.length && initialRenderRef.current)) {
      initialRenderRef.current = false;
      const result = cb(refActualDependencies.current);
      refActualDependencies.current = actualDependencies;

      return result;
    }
    initialRenderRef.current = false;
  }, dependencies);
};

export const useSmartEffectDeep = (
  cb: (previousDependencies: any[]) => void | (() => void),
  dependencies: any[],
  actualDependencies: any[],
) => {
  const refActualDependencies = useRef<any[]>([]);
  useEffect(() => {
    const changed = actualDependencies.some(
      (actualDependency, index) =>
        !isEqual(actualDependency, refActualDependencies.current[index]),
    );
    if (changed) {
      const result = cb(refActualDependencies.current);
      refActualDependencies.current = actualDependencies;

      return result;
    }
  }, [dependencies]);
};
