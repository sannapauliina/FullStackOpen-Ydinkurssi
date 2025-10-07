const Header = (props) => {
  console.log(props)
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <div>
      <p>{props.content[0].part} {props.content[0].exercises}</p>
      <p>{props.content[1].part} {props.content[1].exercises}</p>
      <p>{props.content[2].part} {props.content[2].exercises}</p>
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