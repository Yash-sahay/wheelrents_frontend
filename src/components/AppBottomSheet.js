import { View, Text } from 'react-native'
import React, {  useCallback, useMemo, useRef, useState } from 'react'
import BottomSheet, { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';

const AppBottomSheet = ({children, snapPoints, bottomSheet, setBottomSheet, bottomSheetRef}) => {

      // ref
      // const bottomSheetRef = useRef(null);

      const animationConfigs = useBottomSheetSpringConfigs({
        damping: 10,
        // overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 300,
      });

      // variables
      const snapPointsMemo = useMemo(() => snapPoints, []);
  
      const handleClosePress = () => { setBottomSheet(false); bottomSheetRef.current?.close(); }
      const handleOpenPress = () => { setBottomSheet(true); bottomSheetRef.current?.open(); }
  
  
      // callbacks
      const handleSheetChanges = useCallback((index) => {
          if (index == 0) {
              handleClosePress()
          }
      }, []);

  return (
    <>
      {bottomSheet && (
        <View style={{ position: 'absolute', height: '100%', width: '100%', bottom: 0, left: 0, zIndex: 10 }} >
          <BottomSheet
            // animationConfigs={animationConfigs}
            containerStyle={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            ref={bottomSheetRef}
            index={1}
            enableContentPanningGesture={false}
            snapPoints={snapPointsMemo}
            onChange={handleSheetChanges}
          >
            {children}
          </BottomSheet>
        </View>
      )}
    </>
  )
}

export default AppBottomSheet