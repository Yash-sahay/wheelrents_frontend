import { View, Text } from 'react-native'
import React, {  useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BottomSheet, { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import { useDispatch } from 'react-redux';
import { updateUserDetails } from '../redux/reducer/userReducer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Icon, IconButton } from 'react-native-paper';
import { appstyle } from '../styles/appstyle';

const AppBottomSheet = ({children, snapPoints, bottomSheet, setBottomSheet }) => {
      const dispatch = useDispatch()
      // ref
      const bottomSheetRef = useRef(null);

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
      // const handleSheetChanges = useCallback((index) => {
      //     if (index < 0) {
      //         handleClosePress()
      //     }
      // }, []);

      useEffect(() => {
        if(bottomSheet){
          dispatch(updateUserDetails({bottomSheetOpen: true}))
        }else{
          dispatch(updateUserDetails({bottomSheetOpen: false}))
        }
      }, [bottomSheet])
      

  return (
    <>
      {bottomSheet && (
        <View style={{ position: 'absolute', height: '100%', width: '100%', bottom: 0, left: 0, zIndex: 10 }} >
        
          <GestureHandlerRootView>
          <BottomSheet
            enablePanDownToClose={true}
            onClose={handleClosePress}
            // animationConfigs={animationConfigs}
            containerStyle={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            ref={bottomSheetRef}
            // index={1}
            snapPoints={snapPointsMemo}
            // onChange={handleSheetChanges}
          >
            <View style={{width: '100%', alignItems: 'flex-end', paddingHorizontal: 15}}>
              <IconButton onPress={() => bottomSheetRef.current?.close()} style={{backgroundColor: appstyle.accent}} icon={'close'} color={appstyle.tri} size={20} />
            </View>
            {children}
          </BottomSheet>
        </GestureHandlerRootView>
        </View>
      )}
    </>
  )
}

export default AppBottomSheet