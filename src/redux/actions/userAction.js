export const BASE_URL = 'https://autoapi.elite-lms.com';

export const getOtp = async payLoad => {
  //   console.log(BASE_URL + url,payLoad)
  try {
    const apiResp = await fetch(`${BASE_URL}/verify/time_based/${payLoad}/`, {
      method: 'GET',
      headers: {
        // 'Authorization': `Bearer ${token}`
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .catch(err => {
        alert(err)
        return err;
      });
    return apiResp;
  } catch (error) {
    alert(error)
    return error;
  }
};


export const Precurement = async (apiName, payLoad) => {
  console.log('full url is', BASE_URL + apiName);
  console.log('full payload is', payLoad);
  try {
    const apiResp = await fetch(`${BASE_URL + apiName}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payLoad),
    })
      const resp = apiResp.json()
      if(!resp){
        return false;
      }
      console.warn('error',resp)
    return resp;
  } catch (error) {
    return error;
  }
};

export const VerifyOTP = async (apiName, payLoad) => {
  console.log('full url is', BASE_URL + apiName);
  console.log('full payload is', payLoad);
  try {
    const apiResp = await fetch(`${BASE_URL + apiName}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payLoad),
    })
      .then(response => {
        return response.json();
      })
      .catch(err => {
        return err;
      });
    return apiResp;
  } catch (error) {
    return error;
  }
};

export const CarBrand1 = async url => {
  //   console.log(BASE_URL + url,payLoad)
  const myurl = BASE_URL + url;
  console.log('my url is ==>', myurl);
  try {
    const apiResp = await fetch(myurl, {
      method: 'GET',
      headers: {
        // 'Authorization': `Bearer ${token}`
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .catch(err => {
        return err;
      });
    return apiResp;
  } catch (error) {
    return error;
  }
};
export const CarModel = async (apiName, payLoad) => {
  console.log('full url is', BASE_URL + apiName);
  console.log('full payload is', payLoad);
  try {
    const apiResp = await fetch(`${BASE_URL + apiName}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payLoad),
    })
      .then(response => {
        return response.json();
      })
      .catch(err => {
        return err;
      });
    return apiResp;
  } catch (error) {
    return error;
  }
};

export const Color = async url => {
  //   console.log(BASE_URL + url,payLoad)
  const myurl = BASE_URL + url;
  console.log('my url is ==>', myurl);
  try {
    const apiResp = await fetch(myurl, {
      method: 'GET',
      headers: {
        // 'Authorization': `Bearer ${token}`
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .catch(err => {
        return err;
      });
    return apiResp;
  } catch (error) {
    return error;
  }
};

export const Name = async url => {
    // console.log(BASE_URL + url,payLoad)
  const myurl = BASE_URL + url;
  console.log('my url is ==>', myurl);
  try {
    const apiResp = await fetch(myurl, {
      method: 'GET',
      headers: {
        // 'Authorization': `Bearer ${token}`
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .catch(err => {
        return err;
      });
    return apiResp;
  } catch (error) {
    return error;
  }
};

export const percentage = async url => {
  // console.log(BASE_URL + url,payLoad)
const myurl = BASE_URL + url;
console.log('my url is ==>', myurl);
try {
  const apiResp = await fetch(myurl, {
    method: 'GET',
    headers: {
      // 'Authorization': `Bearer ${token}`
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      return err;
    });
  return apiResp;
} catch (error) {
  return error;
}
};
