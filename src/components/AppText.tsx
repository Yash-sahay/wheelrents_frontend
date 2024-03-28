import { View, Text } from 'react-native'
import React from 'react'
import { TextInputProps } from 'react-native-paper'
import { appstyle } from '../styles/appstyle'

const AppText = (props: TextInputProps) => {
  return <Text {...props} style={{ color: appstyle.tri, ...props?.style as Object}} />
}

export default AppText