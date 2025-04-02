interface FormHeaderProps {
  title: string,
  message: string
}

export const FormHeader = ({title, message}: FormHeaderProps) => {
  return (
    <header>
      <h1 className="text-2xl lg:text-4xl font-semibold capitalize">{title}</h1>
      <p className="text-slate-600 mt-1 text-sm lg:text-base">{message}</p>
    </header>
  );
};
