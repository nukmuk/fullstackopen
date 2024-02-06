import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return <>
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={() => setGood(prev => prev + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(prev => prev + 1)} />
      <Button text="bad" handleClick={() => setBad(prev => prev + 1)} />
    </div>
    <Statistics good={good} neutral={neutral} bad={bad} />
  </>

}

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>
}

const StatisticsLine = (props) => {
  return <tr>
    {props.columns.map(col => <td key={col}>{col}</td>)}
  </tr>
}

const Statistics = (props) => {

  const { good, bad, neutral } = props;
  const all = good + neutral + bad;

  return (
    <div>
      <h1>statistics</h1>

      {all === 0 ?
        <p>No feedback given</p> :
        <table>
          <tbody>
            <StatisticsLine columns={[`good`, good]} />
            <StatisticsLine columns={[`neutral`, neutral]} />
            <StatisticsLine columns={[`bad`, bad]} />
            <StatisticsLine columns={[`all`, all]} />
            <StatisticsLine columns={[`average`, (good - bad) / 3]} />
            <StatisticsLine columns={[`positive`, `${good / (good + neutral + bad) * 100} %`]} />
          </tbody>
        </table>
      }
    </div >
  )
}

export default App