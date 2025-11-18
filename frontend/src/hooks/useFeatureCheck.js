import { useEffect } from 'react';
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
  const { features } = useSelector(state => state.features);
  
  useEffect(() => {
    if (featureNames && featureNames.length > 0) {
      dispatch(checkFeatures(featureNames));
    }
  }, [dispatch, featureNames]);
  
  const featureStatus = {};
  featureNames.forEach(name => {
    const feature = features.find(f => f.featureName === name);
    featureStatus[name] = feature ? feature.isEnabled : false;
  });
  
  return featureStatus;
};

export default useFeatureCheck;