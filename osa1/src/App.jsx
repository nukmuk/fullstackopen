const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (<>
    <div>
      <Header course={course.name} />
      <Content content={course.parts} />
      <Total exercises={course.parts} />
    </div>
  </>
  )
}

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  return <>
    {props.content.map((part) => {
      return < Part key={part.name} part={part} />
    })}
  </>
}

const Part = (props) => {
  console.log(props.part)
  return <>
    <p>{`${props.part.name} ${props.part.exercises}`}</p>
  </>
}

const Total = (props) => {
  const n = props.exercises.reduce((acc, curr) => acc + curr.exercises, 0);
  return <p>Number of exercises {n}</p>
}

export default App