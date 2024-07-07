import { CoursePart } from "../App";
import Part from "./Part";

type ContentProps = {
  courses: CoursePart[];
};

const Content = (props: ContentProps) => {
  return (
    <>
      {props.courses.map((course) => (
        <Part course={course} />
      ))}
    </>
  );
};

export default Content;
