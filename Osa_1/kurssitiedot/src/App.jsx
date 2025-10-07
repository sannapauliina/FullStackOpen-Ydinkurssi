const Header = (props) => {
  console.log(props)
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => {
  console.log(props)
  return (
    <p>{props.name} {props.exercises}</p>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <div>
      <Part name={props.content[0].part} exercises={props.content[0].exercises} />
      <Part name={props.content[1].part} exercises={props.content[1].exercises} />
      <Part name={props.content[2].part} exercises={props.content[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  console.log(props)
  return (
    <div>
      <p>Number of exercises {props.content[0].exercises + props.content[1].exercises + props.content[2].exercises}</p>
    </div>
  )
}

const App = () => {
  const header = {
    nimi: 'Half Stack application development'
  }
  const content = [
    { part: 'Fundamentals of React',  exercises: 10 },
    { part: 'Using props to pass data', exercises: 7 },
    { part: 'State of a component', exercises: 14 }

  ]
  
  return (
    <div>
      <Header course={header.nimi} />
      <Content content={content} />
      <Total content={content} />
    </div>
  )
}

export default App