import React, { Component } from 'react';

import Button from './components/Button/Button';
import styles from './App.module.css';
import Ping from './components/Ping/Ping';

var client = new WebSocket('wss://trade.trademux.net:8800/?password=1234')

class App extends Component {

  state = {
    ws: null,
    disconnected: true,
    messagesQuantity: 0,
    sum: 0,
    average: 0,
    xMinusAverageSqr: 0,
    xMinusAverageSqrSum: 0,
    showStatistic: false
  }
 
  incomingMessageListener = message => {
    let messageData = JSON.parse(message.data) 
    this.setState({
      messagesQuantity: this.state.messagesQuantity + 1,
      sum: this.state.sum + messageData.value,
    }, () => {
      this.setState({
        average: this.state.sum / this.state.messagesQuantity,
        xMinusAverageSqr:  Math.pow(messageData.value - this.state.average, 2)
      }, this.setState({
        xMinusAverageSqrSum: this.state.xMinusAverageSqrSum + this.state.xMinusAverageSqr
      }))
      console.log(this.state)
    })
    
  }

  startConnection = () => {  
    this.setState({
      ws: client,
      disconnected: false
    })
    client.addEventListener('message', this.incomingMessageListener)

  }

  closeSocket = () => {
    this.setState({
      ws: null,
      disconnected: true
    })
  }

  showStatistic = () => {
    client.close()
    this.closeSocket()
    this.setState({
      showStatistic: true
    })
  }

  render () {
    let deviation = Math.sqrt(this.state.xMinusAverageSqrSum / (this.state.messagesQuantity - 1))


    return (
    <div className={styles.App}>
      <Button text="Старт" handler={this.startConnection} />
      <Button text="Статистика" handler={this.showStatistic}/>
      { !this.state.disconnected ? <div className={styles.indicator}></div> : null }
      { this.state.showStatistic ? <p> Среднее арифметическое { this.state.average.toFixed(2) }. Стандартное отклонение { deviation.toFixed(2) } </p> : null }
      <Ping />
    </div>
  );
  }    
}

export default App;
