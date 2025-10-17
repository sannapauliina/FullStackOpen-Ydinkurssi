const Header = ({ course }) => (
  <h1>{course}</h1>
)

const Part = ({ part }) => (
  <p>{part.name} {part.exercises}</p>
)

const Content = ({ parts }) => (
  <div>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => {
    console.log('sum before:', sum, '| current part:', part.name, '-', part.exercises)
    return sum + part.exercises
   }, 0)

  console.log('Total exercises:', total)
   
  return (
    <p><strong>Total of {total} exercises</strong></p>
  )
}

const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course