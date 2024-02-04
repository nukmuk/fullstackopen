import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return <>
    <div>
      <h1>give feedback</h1>
      <button>good</button>
      <button>neutral</button>
      <button>bad</button>
    </div>
    <Statistics good={good} neutral={neutral} bad={bad} />
  </>

}

const Statistics = (props) => {

  const { good, bad, neutral } = props;
  const all = good + neutral + bad;

  return (
    <div>
      <h1>statistics</h1>

      {all === 0 ?
        <p>No feedback given</p> :
        <>
          <p>good {good}</p>
          <p>neutral {neutral}</p>
          <p>bad {bad}</p>
          <p>all {all}</p>
          <p>average {(good - bad) / 3}</p>
          <p>positive {good / (good + neutral + bad) * 100} %</p>
        </>
      }
    </div >
  )
}

export default App