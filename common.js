import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import RazorpayCheckout from 'react-native-razorpay';
import { appstyle } from './src/styles/appstyle';


export function baseURL() {
  return "http://192.168.1.4:5000/" // Local
  return "https://wheelrents-api.onrender.com/" // Live
}

export function dateSimplify(date, extendedHours) {
  if (date) {
    let newdate = new Date(date);
    if (extendedHours > 0) {
      newdate = new Date(newdate.getTime() + (extendedHours * 60 * 60 * 1000))
    }
    const day = newdate.toLocaleString('en-US', { weekday: 'short' });
    const dayOfMonth = newdate.getDate();
    const month = newdate.toLocaleString('en-US', { month: 'short' });
    const year = newdate.getFullYear();

    return `${day} ${dayOfMonth}, ${month}, ${year}`;
  }

  return ''
}

export function amountFormatter(number) {
  return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function timeSimplify(currentDate, extendedHours) {
  if (currentDate) {
    let currTimeInmill = new Date(currentDate)?.getTime()
    let hours = new Date(currentDate).getHours();
    if (extendedHours) {
      hours = new Date(currTimeInmill + (extendedHours * 60 * 60 * 1000)).getHours()
      currTimeInmill = currTimeInmill + (extendedHours * 60 * 60 * 1000)
    }

    // Initialize variables for AM or PM
    var ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)


    // Get the minutes and seconds
    const minutes = JSON.stringify(new Date(currTimeInmill).getMinutes()).length < 2 ? "0" + JSON.stringify(new Date(currTimeInmill).getMinutes()) : JSON.stringify(new Date(currTimeInmill).getMinutes())
    // Format the time
    var timeString = hours + ':' + minutes + ' ' + ampm;
    return timeString
  }
  return ''
}

export function calculateTimePercentage(startTime, endTime, extendedTime) {
  const currentTime = new Date().getTime();
  let totalTime = endTime - startTime;
  const elapsedTime = currentTime - startTime;
  if (extendedTime > 0) {
    totalTime = totalTime + (extendedTime * 60 * 60 * 1000)
  }
  // Calculate percentage
  const percentage = (elapsedTime / totalTime) * 100;

  return (percentage / 10).toFixed(2) / 10; // Limiting to two decimal places
}




const getCoordinates = async (locationString) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}`
    );

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};


export const getDetailsByLatLong = async (lat, long) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse.php?lat=${lat}&lon=${long}&zoom=18&format=jsonv2`
    );

    if (response.data) {
      const { lat, lon } = response.data;
      return { ...response.data };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

export const calculateDistance = (coords1, coords2) => {
  if (!coords1.latitude && !coords2.latitude) {
    return 0
  }
  const R = 6371; // Earth radius in kilometers
  const dLat = (coords2.latitude - coords1.latitude) * (Math.PI / 180);
  const dLon = (coords2.longitude - coords1.longitude) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.latitude * Math.PI) / 180) *
    Math.cos((coords2.latitude * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance.toFixed(1);
};


export const fetchAndCalculateDistance = async (location1, location2) => {
  const coords1 = await getCoordinates(location1);
  const coords2 = await getCoordinates(location2);

  if (coords1 && coords2) {
    const distance = calculateDistance(coords1, coords2);
    console.log(`The distance between ${location1} and ${location2} is approximately ${distance.toFixed(2)} kilometers.`);
    return distance.toFixed(2)
  } else {
    console.log('Could not retrieve coordinates for one or both locations.');
    return ''
  }
};



export async function requestLocationPermission(setter) {
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
          setter && setter(address)

        }, (error) => alert(error.message), {
        enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
      });
    }
    else {
      alert("Locatin access denied!")
      console.log("ACCESS_FINE_LOCATION permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}



export async function getDeviceToken() {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  return token
}


export async function payWithRazorPay({successCallback, failedCallback, amount = 0}) {
  var options = {
    description: 'Credits towards consultation',
    // image: 'https://i.imgur.com/3g7nmJC.png',
    currency: 'INR',
    key: 'rzp_test_XMzTCklzZV4CuY', // Your api key
    amount: amount * 100,
    name: 'Pay to wheelrents',
    // prefill: {
    //   email: 'admin@wheelrents.com',
    //   contact: '9191919191',
    //   name: 'Razorpay Software'
    // },
    theme: { color: appstyle.tri, }
  }
  RazorpayCheckout.open(options).then((data) => {
    // handle success
    successCallback && successCallback(data)
  }).catch((error) => {
    // handle failure
    failedCallback && failedCallback(`Error: ${error.code} | ${error.description}`)
  });

}






