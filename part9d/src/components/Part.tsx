import { CoursePart } from "../App";

type PartProps = {
  course: CoursePart;
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = (props: PartProps) => {
  const result = [];
  result.push(
    <div>
      <b>
        {props.course.name} {props.course.exerciseCount}
      </b>
    </div>
  );

  switch (props.course.kind) {
    case "basic":
      result.push(
        <div>
          <i>{props.course.description}</i>
        </div>
      );
      break;
    case "group":
      result.push(
        <div>project exercises {props.course.groupProjectCount}</div>
      );
      break;
    case "background":
      result.push(
        <>
          <div>
            <i>{props.course.description}</i>
          </div>
          <div>material: {props.course.backgroundMaterial}</div>
        </>
      );
      break;
    case "special":
      result.push(
        <>
          <div>
            <i>{props.course.description}</i>
          </div>
          <div>requirements: {props.course.requirements.join(", ")}</div>
        </>
      );
      break;
    default:
      assertNever(props.course);
      break;
  }

  return <p>{result}</p>;
};

export default Part;
