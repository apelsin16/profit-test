import axios from 'axios';
import React, { useState } from 'react';
import Button from '../Button/Button';
import styles from './Ping.module.css';

export default function Ping() {

  const [ url, setURL ] = useState('');
  const [ ping, setPing ] = useState(0)

  const meterPing = () => {
    const start = new Date();
    axios.get(url)
        .then(function (response) {
            setPing(new Date() - start)
            console.log(response);
        })
        .catch(function (error) {            
            setPing(new Date() - start)
            console.log(error);
          })
  }

  const inputChange = e => {
      setURL(e.target.value)
  }

  return (
    <div>
        <input type="text" value={url} name='input' className={styles.input} onChange={inputChange}/>
        <Button text='Ping' handler={meterPing}/>
        <p>{ ping ? ping : null }</p>
    </div>
  );
}
