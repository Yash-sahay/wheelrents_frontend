import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, PermissionsAndroid, Image } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import AppText from '../components/AppText';
import AppHeader from '../components/AppHeader';
import { appstyle } from '../styles/appstyle';
import { booking_status_change } from '../axios/axios_services/bookingService';
import AppButton from '../components/AppButton';

const QRScanner = ({ navigation }) => {
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

  const [scaning, setScaning] = useState({ scaned: false, id: null })

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    requestCameraPermission()
  }, [])


  const device = useCameraDevice('back')

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      setScaning({ scaned: true, id: codes[0].value })
    }
  })


  useEffect(() => {
    if (scaning.scaned && scaning.id) {
      handleApprove(scaning.id)
    }
  }, [scaning])



  const handleApprove = async (id) => {
    try {
      // setLoader(true)
      const payload = { bookingId: id, bookingStatus: "started" }
      const res = await booking_status_change(payload)
      setLoader(false)
      setScaning({ id: null })
    } catch (error) {
      // setLoader(false)
      console.error("delete error", error)
    }
  };


  if (device == null) return <View>
    <AppText>No Camera found</AppText>
  </View>


  return (
    <>
      <AppHeader ui2 name={"Scan"} />
      <View style={styles.container}>
        {scaning.scaned ? (
          <>
           <View style={{paddingHorizontal: 20, width: '100%', zIndex: 10}}> 
              <AppText style={{textAlign: 'center', fontWeight: "700", fontSize: 20, padding: 40, color: appstyle.textBlack }}>Your booking has begun. Enjoy your trip!</AppText>
            </View>
            <Image
              style={{ width: '100%', height: 500,marginTop: -100, }}
              source={require('../../assets/images/success.gif')}
            />
            <View style={{paddingHorizontal: 30, width: '100%', marginTop: -60,}}> 
              <AppButton icon={'book-play'} onPress={() => navigation.navigate("Booking")}>View Bookings</AppButton>
              <AppText style={{marginTop: -30, textAlign: 'center', fontWeight: "600", fontSize: 16, padding: 40, color: appstyle.textSec }}>We wish you a safe and enjoyable journey!</AppText>
            </View>
          </>
        ) : (
          <>
            <AppText style={{ textAlign: 'center', fontWeight: "bold", fontSize: 20, padding: 40 }}>Scan the QR Code </AppText>
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

            <AppText style={{ width: 350, textAlign: 'center', fontWeight: "600", fontSize: 16, padding: 40, color: appstyle.textSec }}>The vehicle owner has provided a QR code. Please scan the QR code to begin your trip!</AppText>
          </>
        )}
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
    borderColor: appstyle.textSec
  },
  cameraContainer: {
    width: 250,
    height: 250,
    borderRadius: 10,
    overflow: 'hidden'
  }
});

export default QRScanner;
