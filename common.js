import axios from 'axios';



export function baseURL() {
  return "http://192.168.1.8:5000/" // Local
  // return "https://wheelrents-api.onrender.com/" // Live
}

export function dateSimplify(date) {
  if (date) return new Date(date).toDateString()
  return ''
}

export function timeSimplify(currentDate) {
  if (currentDate) {
    var hours = new Date(currentDate).getHours();
    
    // Initialize variables for AM or PM
    var ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    
    
    // Get the minutes and seconds
    const minutes = JSON.stringify(new Date(currentDate).getMinutes()).length < 2 ? "0" + JSON.stringify(new Date(currentDate).getMinutes()) : JSON.stringify(new Date(currentDate).getMinutes())
    // Format the time
    var timeString = hours + ':' + minutes + ' ' + ampm;
    return timeString
  }
  return ''
}

export function calculateTimePercentage(startTime, endTime) {
  const currentTime = new Date().getTime();
  const totalTime = endTime - startTime;
  const elapsedTime = currentTime - startTime;

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

const calculateDistance = (coords1, coords2) => {
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
  return distance;
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

