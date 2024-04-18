import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AppText from './AppText';
import { appstyle } from '../styles/appstyle';
const { width } = Dimensions.get('window');
const CELL_SIZE = width - 40;
const StateSelection = () => {
    const [selectedState, setSelectedState] = useState('Delhi/NCR');

    // Define your list of states
    const states = ['Delhi/NCR', 'Hydrabad', 'Kolkata', 'Mumbai'];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <AppText style={{ fontSize: 20,  color: appstyle.textBlack, paddingHorizontal: 10, fontWeight: 'bold', marginTop: 20  }}>Choose your city :)</AppText>
            <AppText style={{ fontSize: 30,  color: appstyle.textBlack, paddingHorizontal: 10, fontWeight: 'bold', marginBottom: 20 }}>we're ready to serve</AppText>
            <View style={styles.tabsContainer}>
                {states.map((state, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.tab, selectedState === state && styles.activeTab]}
                        onPress={() => setSelectedState(state)}
                    >
                        <AppText style={{ ...styles.tabText, color: selectedState === state ? appstyle.pri : appstyle.textBlack }}>
                            {state}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>
                        <AppText style={{ paddingHorizontal: 10, color: appstyle.textSec }}>
                            {`At present, our services are available in ${states.length} cities.`}
                        </AppText>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    tabsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tab: {
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 2,
        height: CELL_SIZE / 2,
        width: CELL_SIZE / 2,
        borderColor: '#f4f4f2',
        borderRadius: 20,
        marginHorizontal: 5,
    },
    activeTab: {
        backgroundColor: 'black',
    },
    tabText: {
        fontSize: 20,
        fontWeight: '600',
    },
    activeTabText: {
        color: appstyle.pri,
    },
});

export default StateSelection;