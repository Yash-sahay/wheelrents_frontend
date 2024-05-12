import { View, Text, Pressable, Dimensions, Image, Alert, ScrollView, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppText from '../../components/AppText'
import AppTextInput from '../../components/AppTextInput'
import AppButton from '../../components/AppButton'
import { Button, Chip, Icon, TextInput } from 'react-native-paper'
import AppDropDown from '../../components/AppDropDown'
import { get_vehicle_categories, get_vehicle_sub_categroy_by_id } from '../../axios/axios_services/homeService'
import { updateVehicle, vehicleAdd } from '../../axios/axios_services/vehicleService'
import FontAwesome from 'react-native-vector-icons/FontAwesome6'
import ImagePicker from 'react-native-image-crop-picker';
import { baseURL, getDetailsByLatLong } from '../../../common'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import AppHeader from '../../components/AppHeader'
import { appstyle } from '../../styles/appstyle'
import Geolocation from '@react-native-community/geolocation';


const Device_Width = Dimensions.get('window').width


const AddVehicle = ({ route }) => {
    const data = route.params
    const [allValues, setAllValues] = useState(data ? data : {vehicleNo: ""})
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currStep, setCurrStep] = useState(1)
    const [images, setImages] = useState([null, null, null, null])

    const navigation = useNavigation()



    const handleChange = (dynKey, value) => {
        setAllValues((prevState) => ({ ...prevState, [dynKey]: value }))
    }

    const getAllCategory = async () => {
        try {
            const res = await get_vehicle_categories();
            if (res.data) {
                setCategoryList(res.data);
            }
        } catch (error) {
            console.error(error)
        }
    }
    const getAllSubcategoryCategory = async (item) => {
        try {
            const res = await get_vehicle_sub_categroy_by_id({vehicleTypeId: item?._id});
            if (res.data) {
                setSubCategoryList(res.data);
            }
        } catch (error) {
            console.error(error)
        }
    }

    const addUpdateVehicle = async () => {
        try {
            setIsLoading(true)
            const data = new FormData();
            images?.map(imgs => {
                if (imgs?.type) {
                    data.append('files', imgs);
                }
            })
            data.append('name', allValues?.name || "");
            data.append('vehicleNo', allValues?.vehicleNo || "");
            data.append('vehicleCategory', allValues?.vehicleCategory || "");
            data.append('vehicleType', allValues?.vehicleType || "");
            data.append('transmission', allValues?.transmission || "");
            data.append('fuelType', allValues?.fuelType || "");
            data.append('cost', allValues?.cost || "");
            data.append('description', allValues?.description || "");
            data.append('address1', allValues?.address1 || "");
            data.append('address2', allValues?.address2 || "");
            data.append('pinCode', allValues?.pinCode || "");
            data.append('city', allValues?.city || "");
            data.append('country', allValues?.country || "");
            data.append('latitude', allValues?.latitude || "");
            data.append('longitude', allValues?.longitude || "");


            let res;
            if (allValues._id) {
                data.append('_id', allValues._id || "");
                res = await updateVehicle({ data });
            } else {
                res = await vehicleAdd({ data });
            }
            if (res.data?.success) {
                navigation.navigate("HostDashboard")
            } else {
                alert(JSON.stringify(res?.data))
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.error(error)
        }
    }

    useEffect(() => {
        getAllCategory()
        if (data?.files) {
            let arr = [...images]
            data?.files?.map((imgs, i) => {
                arr[i] = { uri: baseURL() + 'public/vehicle/' + imgs.fileName }
            })
            setImages(arr)
        }

        if(route.params?.vehicleCatId){
            getAllSubcategoryCategory({ _id: route.params?.vehicleCatId})
        }
    }, [])


    const AddPictures = ({ onPress, uri, index, data, setter }) => {
        const addImage = () => {
            ImagePicker.openPicker({
                multiple: false,
                // width: 300,
                // height: 400,
                cropping: true,
                freeStyleCropEnabled: true

            }).then(image => {
                let newData = data;
                setter([])
                let pathParts = image.path.split('/');
                let fileName = pathParts[pathParts.length - 1]
                const imageObj = {
                    uri: image.path,
                    type: image.mime,
                    name: fileName,
                }
                newData[index] = imageObj

                setter(newData)
                onPress && onPress(newData);
            });
        }


        return (
            <Pressable key={index} onPress={() => { addImage() }} android_ripple={{ color: appstyle.pri }} style={{ height: 100, width: (Device_Width / 2) - 20, marginTop: 10, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {!uri ? (
                    <Icon source={'camera'} size={40} color='rgba(0,0,0,0.8)' />
                ) : (
                    <Image style={{ flex: 1, height: '100%', width: '100%' }} resizeMode="cover" source={{ uri }} />
                )}
            </Pressable>
        )
    }

    async function requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

            if (granted) {
                console.log("You can use the ACCESS_FINE_LOCATION")

                Geolocation.getCurrentPosition(
                    //Will give you the current location
                    async (position) => {
                        //getting the Longitude from the location json
                        const currentLongitude = JSON.stringify(position.coords.longitude);

                        //getting the Latitude from the location json
                        const currentLatitude = JSON.stringify(position.coords.latitude);

                        const detailLocation = await getDetailsByLatLong(currentLatitude, currentLongitude)
                        const address = detailLocation?.address
                        setAllValues(prevState => {
                            const prevLoc = { address1: prevState?.road, city: prevState?.city, pinCode: prevState?.pinCode, country: prevState?.country, latitude: prevState?.latitude, longitude: prevState?.longitude }
                            let customObj = {}
                            Object.keys(prevLoc).map(itkes => {
                                if(JSON.stringify(prevLoc?.[itkes]?.length) > 0){
                                    customObj = {...customObj, [itkes]: prevLoc[itkes]}
                                } else {
                                    if(itkes == "latitude"){
                                        customObj = {...customObj, [itkes]: currentLatitude}
                                    }else if (itkes == "longitude"){
                                        customObj = {...customObj, [itkes]: currentLongitude}
                                    }else if (itkes == "pinCode"){
                                        customObj = {...customObj, [itkes]: address?.postcode}
                                    }else if (itkes == "address1"){
                                        customObj = {...customObj, [itkes]: address?.road}
                                    }else if (itkes == "address2"){
                                        customObj = {...customObj, [itkes]: allValues?.address2}
                                    }else {
                                        customObj = {...customObj, [itkes]: address[itkes]}
                                    }
                                } 
                            })
                            return {...prevState, ...customObj}
                        })

                    }, (error) => alert(error.message), {
                    enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
                }
                );
            }
            else {
                alert("Locatin access denied!")
                console.log("ACCESS_FINE_LOCATION permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }


    useEffect(() => {
        if (currStep == 3) {
            requestLocationPermission()
        }
    }, [currStep])


    return (
        <>
            <AppHeader ui2 name={data ? "Update Vehicle" : "Add Vehicle"} />
            <View style={{ padding: 15, backgroundColor: appstyle.pri, flex: 1 }}>
                <CustomStepper currStep={currStep} setStep={setCurrStep} />
                <ScrollView style={{ marginTop: 20 }}>
                    {currStep == 3 && (
                        <>
                            <AppTextInput setter={setAllValues} name="address1" allValues={allValues} label={"house no. / flat / area / block"} mode="outlined" />
                            <AppTextInput setter={setAllValues} name="address2" allValues={allValues} label={`landmark / state`} mode="outlined" />
                            <AppTextInput setter={setAllValues} name="pinCode" allValues={allValues} label={"Pin Code"} keyboardType="number-pad" maxLength={6} mode="outlined" />
                            <AppTextInput setter={setAllValues} name="city" allValues={allValues} label={"City"} mode="outlined" />
                            <AppTextInput setter={setAllValues} name="country" allValues={allValues} label={"Country"} mode="outlined" />
                            <AppTextInput setter={setAllValues} style={{ height: 200 }} multiline name="description" allValues={allValues} label={"Vehicle Description"} mode="outlined" />
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <AppButton icon={'arrow-left'} outlined onPress={() => setCurrStep(currStep - 1)} style={{ marginTop: 20, marginRight: 10, width: Device_Width / 2 - 20, borderWidth: 1, borderColor: appstyle.tri }}>
                                    Previous
                                </AppButton>
                                <AppButton icon={'check'} onPress={() => addUpdateVehicle()} loading={isLoading} style={{ marginTop: 20, width: Device_Width / 2 - 20 }}>
                                    Submit
                                </AppButton>
                            </View>
                        </>
                    )}
                    {currStep == 2 && (
                        <>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                {images?.map((imgs, index) => (
                                    <AddPictures data={images} setter={setImages} index={index} onPress={(newData) => { }} uri={imgs?.uri} />
                                ))}
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <AppButton icon={'arrow-left'} outlined onPress={() => setCurrStep(currStep - 1)} style={{ marginTop: 20, marginRight: 10, width: Device_Width / 2 - 20, borderWidth: 1, borderColor: appstyle.tri }}>
                                    Previous
                                </AppButton>
                                <AppButton onPress={() => setCurrStep(currStep + 1)} style={{ marginTop: 20, width: Device_Width / 2 - 20 }}>
                                    Next
                                </AppButton>
                            </View>
                        </>
                    )}

                    {currStep == 1 && (
                        <>
                            <AppTextInput setter={setAllValues} 
                            left={<TextInput.Icon icon="car" />}
                            name="name" allValues={allValues} label={"Vehicle Name"} mode="outlined" />
                            <AppDropDown
                                setter={setAllValues}
                                name="vehicleCategory"
                                allValues={allValues}
                                renderLeftIcon={() => <TextInput.Icon icon="clipboard-list" />}
                                data={categoryList}
                                onChange={(item) => getAllSubcategoryCategory(item)}
                                labelField={'name'}
                                valueField={'name'}
                                label={"Vehicle Category"}
                            />
                            {(allValues?.vehicleCategory) &&
                                <AppDropDown
                                setter={setAllValues}
                                name="vehicleType"
                                allValues={allValues}
                                data={subCategoryList}
                                renderLeftIcon={() => <TextInput.Icon icon="clipboard-list-outline" />}
                                labelField={'name'}
                                valueField={'name'}
                                label={"Vehicle Type"}
                            />}
                            <View>
                                <AppText style={{ fontWeight: 'bold', paddingVertical: 10, marginTop: 10 }}>Fuel Type</AppText>
                                <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                    <CustomChip
                                        keyValue={'fuelType'}
                                        name={"petrol"}
                                        style={{ marginLeft: 4 }}
                                        onPress={(val) => handleChange("fuelType", val)}
                                        allValues={allValues}>Petrol</CustomChip>
                                    <CustomChip
                                        keyValue={'fuelType'}
                                        style={{ marginLeft: 10 }}
                                        onPress={(val) => handleChange("fuelType", val)}
                                        name={"diesel"}
                                        allValues={allValues}>Diesel</CustomChip>
                                    <CustomChip
                                        keyValue={'fuelType'}
                                        style={{ marginLeft: 10 }}
                                        onPress={(val) => handleChange("fuelType", val)}
                                        name={"electric"}
                                        allValues={allValues}>Electric</CustomChip>
                                    <CustomChip
                                        keyValue={'fuelType'}
                                        style={{ marginLeft: 10 }}
                                        onPress={(val) => handleChange("fuelType", val)}
                                        name={"CNG"}
                                        allValues={allValues}>CNG</CustomChip>
                                </View>
                            </View>
                            <AppTextInput setter={setAllValues} 
                             left={allValues?.vehicleNo?.length < 1 ? <TextInput.Icon icon="numeric" />  : ''}
                            name="vehicleNo" allValues={allValues} label={"Vehicle No"} mode="outlined" />

                            <View>
                                <AppText style={{ fontWeight: 'bold', paddingVertical: 10, marginTop: 10 }}>Transmission</AppText>
                                <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                    <CustomChip
                                        icon={'fuel'}
                                        style={{ marginLeft: 4 }}
                                        keyValue={'transmission'}
                                        name={"manual"}
                                        onPress={(val) => handleChange("transmission", val)}
                                        allValues={allValues}>Manual</CustomChip>
                                    <CustomChip
                                        keyValue={'transmission'}
                                        style={{ marginLeft: 10 }}
                                        onPress={(val) => handleChange("transmission", val)}
                                        name={"automatic"}
                                        allValues={allValues}>Automatic</CustomChip>
                                </View>
                            </View>
                            <AppTextInput setter={setAllValues} name="cost"
                            left={<TextInput.Icon color={"green"} icon="cash" />}
                            allValues={allValues} label={`Cost "Per hour"`} inputMode="numeric" mode="outlined" />
                            <AppButton onPress={() => setCurrStep(currStep + 1)} style={{ marginTop: 20 }}>
                                Next
                            </AppButton>
                        </>
                    )}
                </ScrollView>

            </View>
        </>
    )
}


const CustomChip = ({ allValues, name, keyValue, children, style, onPress, icon }) => {
    return (
        <Chip
            selectedColor={appstyle.pri}
            elevated
            elevation={1}
            selected={allValues?.[keyValue] == name}
            style={{ backgroundColor: allValues?.[keyValue] == name ? appstyle.tri : appstyle.accent, shadowColor: appstyle.shadowColor, ...style }}
            textStyle={{ color: allValues?.[keyValue] == name ? appstyle.pri : appstyle.tri }}
            onPress={() => onPress(name)}>{children}</Chip>
    )
}



const CustomStepper = ({ currStep, setStep }) => {
    const arr = [
        { name: 'Add Details', step: 1 },
        null,
        { name: 'Add Visuals', step: 2 },
        null,
        { name: 'Add Address', step: 3 },
    ]
    const activeStyle = {
        backgroundColor: appstyle.tri,
    }
    const inActiveStyle = {
        backgroundColor: appstyle.pri
    }


    return (
        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 10, marginTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>
            {arr?.map((steps, index) => {

                const active = currStep >= (steps?.step)
                if (!steps) {
                    return <FontAwesome name={'arrow-right-long'} color={appstyle.tri} size={30} />
                }
                return (
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <Pressable onPress={() => setStep(steps?.step)} style={{ alignItems: 'center' }}>
                            <View style={[{ height: 50, width: 50, borderRadius: 100, alignItems: 'center', borderWidth: 3.1, justifyContent: 'center' }, active ? activeStyle : inActiveStyle]}>
                                <AppText style={{ color: active ? appstyle.pri : appstyle.tri, fontWeight: '900', fontSize: 17 }}>{steps?.step}</AppText>
                            </View>
                            <AppText style={{ color: !active ? appstyle.tri : appstyle.tri, fontWeight: !active ? '600' : '900', fontSize: 12 }}>{steps?.name}</AppText>
                        </Pressable>
                    </View>
                )
            })}
        </View>
    )
}

export default AddVehicle