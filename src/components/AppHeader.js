import { View, Text, TextInput, Dimensions, TouchableOpacity, Easing, FlatList, StatusBar, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Appbar, Button, Chip, IconButton, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import AppText from './AppText';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import AppDatePicker from './AppDatePicker';
import AppBottomSheet from './AppBottomSheet';
import { appstyle } from '../styles/appstyle';
import { updateUserDetails } from '../redux/reducer/userReducer';

const Device_Width = Dimensions.get('window').width - 20;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        backgroundColor: appstyle.pri,
        padding: 15,
        paddingBottom: 0,
        paddingTop: 35,
    },
    headerContainer: {
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    locationText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    locationInfo: {
        fontWeight: 'bold',
        
    },
    searchBarContainer: {
        flexDirection: 'row',
        width: Device_Width - 10 - 70,
        borderRadius: 10,
        backgroundColor: '#1d1d1d',
        color: appstyle.pri,
        // borderWidth: 2,
        borderColor: '#f4f4f2',
        // borderStyle: 'dashed',
        marginTop: 10,
    },
    searchBar: {
        padding: 0,
        height: 40,
        color: appstyle.pri
    },
    filterButtonContainer: {
        padding: 1,
        overflow: 'hidden',
    },
    filterButton: {
        padding: 0,
        backgroundColor: 'rgba(0,0,0, 1)',
        height: 54,
        width: 55,
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterIcon: {
        color: appstyle.pri,
        size: 20,
    },
    filterStatusContainer: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: appstyle.tri,
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    filterStatusContainerOpen: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: appstyle.tri,
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    filterStatusContainerClosed: {
        height: 60,
        width: 60,
    },
    filterStatusContainerOpenHeight: {
        height: 50,
    },
    filterStatusContainerClosedHeight: {
        height: 0,
    },
    filterChipContainer: {
        marginVertical: 10,
    },
});

const AppHeader = ({ mode = "light", ui2, name, isExtended, filterPress, filtersData, accent, scrollPosition, search = false }) => {
    const route = useRoute();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filterStatus, setFilterStatus] = React.useState(false);
    const [dontSet, setDontSet] = React.useState(0);
    const [focus, setFocus] = useState(false);
    const [bottomSheet, setBottomSheet] = useState(false);

    const { currRoute, role, searchString, recentSearches, username, email } = useSelector(state => state.userReducer)
    const searchRef = useRef(null)

    const height = useSharedValue(0);
    const filterHeight = useSharedValue(0);

    const styleHeader = useAnimatedStyle(() => ({
        height: withTiming(height.value, {
            duration: 200,
            reduceMotion: ReduceMotion.System,
        }),
    }));

    const styleFilter = useAnimatedStyle(() => ({
        height: withTiming(filterHeight.value, {
            duration: 200,
            reduceMotion: ReduceMotion.System,
        }),
    }));

    useEffect(() => {

        if (scrollPosition > 0) {
        }
        if (!isExtended) {
            height.value = 0
        } else {
            height.value = 50;
        }
        setBottomSheet(false);
    }, [scrollPosition, isExtended]);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(updateUserDetails({ currRoute: route.name || '' }));
            if (route.name == "Search") {
                setTimeout(() => {
                    searchRef.current.focus()
                }, 200);
            } else {
                dispatch(updateUserDetails({ searchString: '' }));
            }
        }, [route.name])
    );

    // ref
    const bottomSheetRef = useRef(null);
    const handleClosePress = () => {
        setBottomSheet(false);
        bottomSheetRef.current?.close();
    };
    const handleOpenPress = () => {
        setBottomSheet(true);
        bottomSheetRef.current?.open();
    };

    const onChangeSearch = query => dispatch(updateUserDetails({ searchString: query }));

    const submitEdit = () => {
        navigation.navigate("Result", {searchString})
        dispatch(updateUserDetails({ recentSearches: recentSearches?.length > 0 ? [...recentSearches, searchString] : [searchString] }))
    }


    if (!ui2) {
        return (
            <>
                <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['1%', '60%']} bottomSheet={bottomSheet} setBottomSheet={setBottomSheet}>
                    <AppDatePicker />
                </AppBottomSheet>
                <StatusBar animated backgroundColor={'transparent'} barStyle={(route.name == "Search" || mode == "dark") ? "light-content" : 'dark-content'} translucent showHideTransition={'fade'} />
                <View style={[styles.container, (route.name == "Search" || mode == "dark" ) && {backgroundColor: appstyle.tri}, !isExtended && { elevation: 5, borderBottomWidth: 2, borderColor: '#f4f4f2' }]}>
                    <Animated.View style={[styles.headerContainer, styleHeader]}>
                        <TouchableOpacity onPress={handleOpenPress}>
                            <AppText style={{...styles.locationText, color: mode == "dark" ? '#ddd' : appstyle.tri}}>Location</AppText>
                            <AppText style={{...styles.locationInfo, color: mode == "dark" ? '#ddd' : appstyle.tri}}>
                                <FontAwesome name="map-pin" /> New Delhi, India  <FontAwesome color={mode == "dark" ? appstyle.pri : appstyle.tri} name="chevron-down" />
                            </AppText>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row' }}>
                            {role?.includes('client') && <IconButton onPress={() => navigation.navigate("QRScanner")} style={{ backgroundColor: appstyle.accent, elevation: 10, shadowColor: appstyle.shadowColor, borderWidth: 1, borderColor: '#fff' }} iconColor={appstyle.tri} size={20} icon="qrcode-scan" />}
                            <IconButton onPress={() => navigation.navigate('Notification')} style={{ backgroundColor: mode == "dark" ? '#1d1d1d' : appstyle.accent, elevation: 10, shadowColor: appstyle.shadowColor, borderWidth: mode == "dark" ? 0 : 1, borderColor: '#fff' }} iconColor={mode == "dark" ? appstyle.pri : appstyle.tri} size={20} icon="bell" />
                        </View>
                    </Animated.View>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        {focus && <View style={[styles.filterButtonContainer]}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={[styles.filterButton, {backgroundColor: appstyle.tri}]}>

                                <FontAwesome5 style={[styles.filterIcon, {color: appstyle.pri}]} size={20} name="chevron-left" />
                            </TouchableOpacity>
                        </View>}
                        
                        <Searchbar
                            onFocus={() => setFocus(true)}
                            // onBlur={() => setFocus(false)}
                            editable={search}
                            inputStyle={styles.searchBar}
                            onSubmitEditing={(val) => submitEdit(val)}
                            placeholderTextColor={appstyle.textSec}
                            style={[styles.searchBarContainer, focus ? {} : { display: 'none' }]}
                            placeholder="Search for vehicles"
                            disableFullscreenUI
                            ref={searchRef}
                            onChangeText={onChangeSearch}
                            value={searchString}
                        />
                        {!focus && <View>
                            <AppText style={{ fontWeight: 'bold', fontSize: 25, color: appstyle.textSec }}>Welcome,</AppText>
                            <AppText style={{ fontWeight: 'bold', fontSize: 30, marginTop: -8, color: mode == 'dark' ? "#ddd" : appstyle.textBlack }}>{username}</AppText>
                        </View>
                        }
                        {!focus && (
                            <View style={[styles.filterButtonContainer]}>
                                <TouchableOpacity
                                    onPress={() => mode == "dark" ? navigation.navigate("AddVehicle") : navigation.navigate("Search")
                                        // setFilterStatus(status => {
                                        //     if (!status) {
                                        //         filterHeight.value = 50;
                                        //     } else {
                                        //         filterHeight.value = 0;
                                        //     }
                                        //     return !status;
                                        // })
                                    }
                                    style={[styles.filterButton, {backgroundColor: mode == "dark" ? appstyle.tri : appstyle.pri}]}>
                                    {mode == "dark" && <Entypo style={[styles.filterIcon, {color: mode == "dark" ? appstyle.pri : appstyle.tri}]} size={30} name="add-to-list" /> }
                                    {mode != "dark" && <FontAwesome5 style={[styles.filterIcon, {color: mode == "dark" ? appstyle.pri : appstyle.tri}]} size={30} name="search" />}
                                    {mode == "dark" && <AppText style={{ fontWeight: 'bold', fontSize: 16, color: mode == "dark" ? appstyle.pri : appstyle.tri }}>New</AppText>}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <Animated.View style={styles.filterChipContainer}>{(filtersData && filterStatus) && <FlatList
                        data={filtersData}
                        horizontal
                        renderItem={({ item, index }) =>
                            <Chip
                                selectedColor={appstyle.pri}
                                elevated
                                elevation={1}
                                selected={item?.selected}
                                style={{ backgroundColor: item?.selected ? appstyle.tri : appstyle.pri, marginHorizontal: 5, height: 30 }}
                                textStyle={{ color: item?.selected ? appstyle.pri : appstyle.tri }}
                                onPress={() => {
                                    setDontSet(cal => cal + 1);
                                    filtersData[index] = { ...item, selected: !item.selected };
                                    filterPress && filterPress(filtersData);
                                }
                                }>{item.name}</Chip>} />}</Animated.View>
                </View>
            </>
        );
    }

    return (
        <View style={{ backgroundColor: appstyle.tri, paddingTop: 35 }}>
            <StatusBar animated backgroundColor={appstyle.tri} barStyle={'light-content'} showHideTransition={'fade'} />
            <View mode="center-aligned" style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingVertical: 20, justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ borderRadius: 100, elevation: 0, backgroundColor: appstyle.tri, padding: 10 }} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={20} color={appstyle.pri} />
                </TouchableOpacity>
                <AppText style={{ fontSize: 25, fontWeight: 'bold', color: appstyle.priBack, textTransform: 'capitalize' }}>{name || route.name}</AppText>
                <AppText style={{ fontSize: 25, fontWeight: 'bold', color: appstyle.pri }}>     </AppText>
            </View>
            {accent != 'opp' && <View style={{ width: '100%', backgroundColor: appstyle.pri, borderTopRightRadius: 10, borderTopLeftRadius: 10, padding: 10 }}></View>}
        </View>
    );
};

export default AppHeader;
