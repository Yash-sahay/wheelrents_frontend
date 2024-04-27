import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated';
const BannerOpenView = ({route}) => {
    const data = route.params?.uri;
    const tag = route.params?.tag
  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: data}}
        style={{ width: 100, height: 100 }}
        sharedTransitionTag={tag}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
  });
export default BannerOpenView