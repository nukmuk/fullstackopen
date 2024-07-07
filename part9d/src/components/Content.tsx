type Course = {
  name: string;
  exerciseCount: number;
};

type ContentProps = {
  courses: Course[];
};

const Content = (props: ContentProps) => {
  return (
    <>
      {props.courses.map((course) => (
        <p>
          {course.name} {course.exerciseCount}
        </p>
      ))}
    </>
  );
};

export default Content;
