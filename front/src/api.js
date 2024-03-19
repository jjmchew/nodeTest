const BASE_URL = process.env.NODE_ENV === 'production'
                 ? 'https://jjmchew.a2hosted.com/testa/api/persons'
                 : 'http://localhost:3001/api/persons';

async function api(method, data=undefined){
  // console.log('api', data);
  let options = {};
  let url = BASE_URL;
  switch (method) {
    case 'get':
      options = { method: 'GET' };
      break;
    case 'delete':
      options = { method: 'DELETE' };
      url = BASE_URL + '/' + data.id;
      break;
    case 'post':
      options = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.person),
      };
      break;
  }

  return fetch(url, options)
  .then(raw => {
    return raw.json();
  })
  .then(resp => {
    return resp;
  })
  .catch(err => console.log('Error: ', err.message));

}

// ********************
const getData = () => {
  return api('get');
};

// ********************
const deleteData = id => {
  return api('delete', {id: id});
};

// ********************
const addData = newObj => {
  return api('post', {person: newObj});
};

// ********************
const getId = id => {
  return fetch(BASE_URL + '/' + id)
    .then(raw => raw.json())
    .catch(err => console.log('Error: ', err));
};

export default { getData, deleteData, addData };
