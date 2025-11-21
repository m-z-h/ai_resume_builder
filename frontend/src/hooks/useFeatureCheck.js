import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkFeature, checkFeatures } from '../store/featureSlice';

const useFeatureCheck = (featureName) => {
  const dispatch = useDispatch();
  const { features } = useSelector(state => state.features);
  
  useEffect(() => {
    if (featureName) {
      dispatch(checkFeature(featureName));
    }
  }, [dispatch, featureName]);
  
  const feature = features.find(f => f.featureName === featureName);
  return feature ? feature.isEnabled : false;
};

export const useMultipleFeatureCheck = (featureNames) => {
  const dispatch = useDispatch();
  const { features, isLoading } = useSelector(state => state.features);
  
  // Memoize the feature names array to prevent unnecessary re-renders
  const memoizedFeatureNames = useMemo(() => featureNames, [JSON.stringify(featureNames)]);
  
  useEffect(() => {
    if (memoizedFeatureNames && memoizedFeatureNames.length > 0) {
      dispatch(checkFeatures(memoizedFeatureNames));
    }
  }, [dispatch, memoizedFeatureNames]);
  
  // Create a function to check if a feature is enabled
  const hasFeatureAccess = (featureName) => {
    const feature = features.find(f => f.featureName === featureName);
    return feature ? feature.isEnabled : false;
  };
  
  return { hasFeatureAccess, featureLoading: isLoading };
};

export default useFeatureCheck;