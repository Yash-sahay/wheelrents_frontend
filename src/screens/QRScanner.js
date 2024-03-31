import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import AppText from '../components/AppText';
import AppHeader from '../components/AppHeader';
import { appstyle } from '../styles/appstyle';

const QRScanner = () => {
  const cameraRef = useRef(null);

  // useEffect(() => {
  //   const startScanning = async () => {
  //     try {
  //       await cameraRef.current?.startScanningQRCodes((event) => {
  //         // Handle QR code scanning event
  //         console.log('Scanned QR code:', event.qrCode.stringValue);
  //       });
  //     } catch (error) {
  //       console.error('Error starting QR code scanning:', error);
  //     }
  //   };

  //   startScanning();

  //   return () => {
  //     // Cleanup code if needed
  //   };
  // }, []);

  const device = useCameraDevice('back')

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      alert(`Scanned ${codes.length} codes!`)
    }
  })

  if (device == null) return <View>
    <AppText>No Camera found</AppText>
  </View>


  return (
    <>
      <AppHeader ui2 name={"Scan"} />
    <View style={styles.container}>
        <AppText style={{textAlign: 'center', fontWeight: "bold", fontSize: 20, padding: 40}}>Scan the QR Code </AppText>
      <View style={styles.cameraBorderContainer}>
      <View style={styles.cameraContainer}>
        <Camera
          // ref={cameraRef}
          codeScanner={codeScanner}
          style={styles.camera}
          device={device}
          isActive={true}
          cameraConfiguration={{
            // Configure camera settings if needed
          }}
        />
      </View>
      </View>
          
          <AppText style={{width: 350, textAlign: 'center', fontWeight: "600", fontSize: 16, padding: 40, color: 'grey'}}>The vehicle owner has provided a QR code. Please scan the QR code to begin your trip!</AppText>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appstyle.pri,
  },
  camera: {
    width: 250,
    height: 250,
    borderRadius: 10,
    overflow: 'hidden'
  },
  cameraBorderContainer: {
    borderWidth: 5,
    borderRadius: 20,
    padding: 10,
    borderStyle: "dashed",
    borderColor: 'grey'
  },
  cameraContainer: {
    width: 250,
    height: 250,
    borderRadius: 10,
    overflow: 'hidden'
  }
});

export default QRScanner;