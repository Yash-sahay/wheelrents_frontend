import { View, Text, Pressable, Dimensions, Image, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppText from '../../components/AppText'
import AppTextInput from '../../components/AppTextInput'
import AppButton from '../../components/AppButton'
import { Button, Chip, Icon } from 'react-native-paper'
import AppDropDown from '../../components/AppDropDown'
import { get_vehicle_categories } from '../../axios/axios_services/homeService'
import { vehicleAdd } from '../../axios/axios_services/vehicleService'
import FontAwesome from 'react-native-vector-icons/FontAwesome6'
import ImagePicker from 'react-native-image-crop-picker';
import { baseURL } from '../../../common'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import AppHeader from '../../components/AppHeader'
import { appstyle } from '../../styles/appstyle'


const Device_Width = Dimensions.get('window').width


const AddVehicle = ({route}) => {
    const data = route.params
    const [allValues, setAllValues] = useState(data ? data : {})
    const [categoryList, setCategoryList] = useState([])
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

    const addNewVehicle = async () => {
        try {
            setIsLoading(true)
            const data = new FormData();
            images?.map(imgs => {
                if (imgs?.type) {
                    data.append('files', imgs);
                }
            })
            data.append('name', allValues?.name);
            data.append('vehicleNo', allValues?.vehicleNo);
            data.append('vehicleCategory', allValues?.vehicleCategory);
            data.append('transmission', allValues?.transmission);
            data.append('fuelType', allValues?.fuelType);
            data.append('cost', allValues?.cost);
            data.append('description', allValues?.description);
            data.append('address1', allValues?.address1);
            data.append('address2', allValues?.address2);
            data.append('pinCode', allValues?.pinCode);


            const res = await vehicleAdd({ data });
            if (res.data?.success) {
                console.warn(res.data)
                navigation.navigate("Home")
            }else{
                alert(JSON.stringify(res.data))
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.error(error)
        }
    }

    useEffect(() => {
        getAllCategory()
        if(data?.files){
            let arr = [...images]
            data?.files?.map((imgs, i) => {
                arr[i] = {uri: baseURL() + 'public/vehicle/' + imgs.fileName}
            })
            setImages(arr)
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


    return (
        <>
        <AppHeader ui2 name={data ? "Update Vehicle" : "Add Vehicle"}/>
        <View style={{ padding: 15, backgroundColor: appstyle.pri, flex: 1 }}>
            <CustomStepper currStep={currStep} setStep={setCurrStep} />
            <ScrollView style={{ marginTop: 20 }}>
                {currStep == 3 && (
                    <>
                        <AppTextInput setter={setAllValues} name="address1" allValues={allValues} label={"house no. / flat / area / block"} mode="outlined" />
                        <AppTextInput setter={setAllValues} name="address2" allValues={allValues} label={`landmark / state`} mode="outlined" />
                        <AppTextInput setter={setAllValues} name="pinCode" allValues={allValues} label={"Pin Code"} keyboardType="number-pad" maxLength={6} mode="outlined" />
                        <AppTextInput setter={setAllValues} style={{height: 200}} multiline name="decsription" allValues={allValues} label={"Vehicle Description"} mode="outlined" />
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <AppButton icon={'arrow-left'}  outlined onPress={() => setCurrStep(currStep - 1)} style={{ marginTop: 20, marginRight: 10, width: Device_Width / 2 - 20, borderWidth: 1, borderColor: appstyle.tri }}>
                                Previous
                            </AppButton>
                            <AppButton icon={'check'} onPress={() => addNewVehicle()} loading={isLoading} style={{ marginTop: 20, width: Device_Width / 2 - 20 }}>
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
                        <AppTextInput setter={setAllValues} name="name" allValues={allValues} label={"Vehicle Name"} mode="outlined" />
                        <AppDropDown
                            setter={setAllValues}
                            name="vehicleCategory"
                            allValues={allValues}
                            data={categoryList}
                            labelField={'name'}
                            valueField={'name'}
                            label={"Vehicle Category"}
                        />
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
                        <AppTextInput setter={setAllValues} name="vehicleNo" allValues={allValues} label={"Vehicle No"} mode="outlined" />

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
                        <AppTextInput setter={setAllValues} name="cost" allValues={allValues} label={`Cost "Per hour"`} inputMode="numeric" mode="outlined" />
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