import { Logo } from "@/modules/core/components/logo";
import { FormHeader } from "./form-header";
import Link from "next/link";

interface FormWrapper {
  title: string;
  message: string;
  altQuestionText: string;
  altActionText: string;
  altActionLink: string;
  children: React.ReactNode;
}

const FormWrapper = ({
  title,
  message,
  altActionLink,
  altActionText,
  altQuestionText,
  children,
}: FormWrapper) => {
  return (
    <div>
      <Logo className="mb-6" />
      <FormHeader title={title} message={message} />

      <div className="mt-8 mb-9">{children}</div>

      <Link
        className="hover:underline text-sm text-slate-500 text-center block"
        href={altActionLink}
      >
        {altQuestionText}
        {"  "}
        <span className="text-blue-600 font-medium">{altActionText}</span>
      </Link>
    </div>
  );
};

export default FormWrapper;
