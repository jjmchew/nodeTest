import { useState, useEffect } from 'react';
import './App.css';
import Message from './Message.jsx';
import Api from './api.js';

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [newName, setNewName] = useState('');
  const [newNum, setNewNum] = useState('');
  const [msg, setMsg] = useState(null);

  const MSG_TIME = 3500;

  const useApi = fct => {
    setLoading(true);
    return fct();
  };

  useEffect(() => {
    useApi(Api.getData)
    .then(resp => {
      console.log(resp);
      setData(resp);
      setLoading(false);
    });
  }, []);

  const handleDelete = id => {
    useApi(() => Api.deleteData(id))
    .then(resp => {
      setData(data.filter(obj => obj.id !== resp.id));
      setLoading(false);
      showMsg(`${resp.name} deleted`);
    });
  };

  const isValidData = () => {
    let result = true;
    if (!newName || !newNum) result = result && false;
    if (data.map(obj => obj.name).includes(newName)) {
      result = result && false;
    }
    return result;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!isValidData()) {
      console.log('invalid data');
      showMsg(`invalid data entered`);
      return;
    }

    useApi(() => Api.addData({
      name: newName,
      number: newNum,
    }))
    .then(resp => {
      setData(data.concat(resp));
      setLoading(false);
      showMsg('contact added');
    });

    setNewName('');
    setNewNum('');
  };

  const showMsg = str => {
    setMsg(str);
    setTimeout(()=> setMsg(null), MSG_TIME);
  };

  const dispMsg = msg
                  ? <Message msg={msg} />
                  : null;

  if (loading) return (<h3>loading...</h3>);
  if (!data) return null;
  return (
    <>
      <h1>Simple phonebook</h1>
      {dispMsg}
      <ul>
        {
          data.map(obj => {
            return (
              <li key={obj.id}>
                {obj.name}: {obj.number}
                <input
                  type="button"
                  value="delete"
                  onClick={() => handleDelete(Number(obj.id))}
                />
              </li>
            );
          })
        }
      </ul>
      <br/>
      <h3>Add new entry</h3>
      <form onSubmit={e => handleSubmit(e)}>
        <dl>
          <dt>Name: </dt>
          <dd>
            <input
              value={newName}
              placeholder='Enter new name'
              onChange={e=>setNewName(e.target.value)}
            />
          </dd>
        </dl>
        <dl>
          <dt>Number: </dt>
          <dd>
            <input
              value={newNum}
              placeholder='Enter new number'
              onChange={e=>setNewNum(e.target.value)}
            />
          </dd>
        </dl>
        <input type='submit' value='Add' />
      </form>
    </>
  );
}

export default App;
