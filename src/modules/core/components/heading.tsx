type HeadingProps = HeadingGreeting | HeadingDefault;
interface HeadingGreeting {
  type: "greeting";
  name: string;
  title: string;
  subtitle: string;
}

interface HeadingDefault {
  type: "default";
  title: string;
  subtitle: string;
}

export const Heading = (props: HeadingProps) => {

  return (
    <>
      {props.type == "greeting" && (
        <h2 className="font-bold text-3xl">
          {props.title} <span className="text-sky-500">{props.name}</span>
        </h2>
      ) }

      {
        props.type == "default" && (
          <h2>{props.title}</h2>
        )
      }

      <h3 className="text-base text-slate-700 mt-1 ">{props.subtitle}</h3>
    </>
  );
};
