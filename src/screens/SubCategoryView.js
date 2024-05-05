import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AppText from '../components/AppText';
import { appstyle } from '../styles/appstyle';
import AppHeader from '../components/AppHeader';
import { get_vehicle_sub_categroy_by_id } from '../axios/axios_services/homeService';
import AppShimmer from '../components/AppShimmer';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');
const CELL_SIZE = width - 40;
const SubCategoryView = ({route}) => {
    const navigation = useNavigation()
    // const [selectedState, setSelectedState] = useState('Delhi/NCR');
    const routeData = route.params;
    const [subCategoryList, setSubCategoryList] = useState([null, null, null, null, null, null, null, null, null, null, null])


    const getAllSubcategoryCategory = async (item) => {
        try {
            const res = await get_vehicle_sub_categroy_by_id({vehicleTypeId: routeData?._id});
            if (res.data) {
                setSubCategoryList(res.data);
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getAllSubcategoryCategory()
    }, [])

    


    return (
        <>
        <AppHeader ui2 name={routeData?.name?.toUpperCase()}  />
        <ScrollView contentContainerStyle={styles.container}>
            <AppText style={{ fontSize: 20,  color: appstyle.textBlack, paddingHorizontal: 10, fontWeight: 'bold', marginTop: 20  }}>Choose your option</AppText>
            <AppText style={{ fontSize: 30,  color: appstyle.textBlack, paddingHorizontal: 10, fontWeight: 'bold', marginBottom: 20 }}>Showing types of {routeData?.name?.toUpperCase()}</AppText>
            <View style={styles.tabsContainer}>
                {subCategoryList?.map((subcate, index) => (
                    
                    <TouchableOpacity
                        key={index}
                        style={[styles.tab]}
                        onPress={() => subcate?.name && navigation.navigate("Result", { searchString: subcate?.name})}
                    >
                        <AppShimmer style={{ ...styles.tabText, width: '100%', borderRadius: 10, height: 20, }} visible={subcate == null ? false : true}>
                        <AppText style={{ ...styles.tabText, color: appstyle.textBlack }}>
                            {subcate?.name}
                        </AppText>
                        </AppShimmer>

                    
                    </TouchableOpacity>
                ))}
            </View>
                        <AppText style={{ paddingHorizontal: 10, color: appstyle.textSec }}>
                            {/* {`At present, our services are available in ${states.length} cities.`} */}
                        </AppText>
        </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: appstyle.pri
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
        overflow: 'hidden'
    },
    activeTab: {
        backgroundColor: 'black',
    },
    tabText: {
        fontSize: 20,
        fontWeight: '600',
        textTransform: 'capitalize',
        fontWeight: '600'
    },
    activeTabText: {
        color: appstyle.pri,
    },
});

export default SubCategoryView;