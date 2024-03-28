import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { appstyle } from '../styles/appstyle'

const Marque = ({ children, style }) => {

    const scrollRef = useRef();

    const scroll = () => {
        scrollRef.current?.scrollTo({
            x: 0,
            animated: true,
        });
    }

    useEffect(() => {
        scroll()
    },[])

    return (
        <View>
            <Text style={{ ...style }}>{children}</Text>
        </View>
    )
}

export default Marque