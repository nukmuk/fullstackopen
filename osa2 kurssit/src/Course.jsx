const Course = (props) => {
    return <>
        <Header name={props.course.name} />
        <Content parts={props.course.parts} />
        <Total parts={props.course.parts} />
    </>
}

const Header = (props) => {
    return (
        <h2>{props.name}</h2>
    )
}

const Content = (props) => {
    return <>
        {props.parts.map((part) => {
            return < Part key={part.name} part={part} />
        })}
    </>
}

const Part = (props) => {
    return <>
        <p>{`${props.part.name} ${props.part.exercises}`}</p>
    </>
}

const Total = (props) => {
    const n = props.parts.reduce((acc, curr) => acc + curr.exercises, 0);
    return <p><b>Number of exercises {n}</b></p>
}

export default Course;