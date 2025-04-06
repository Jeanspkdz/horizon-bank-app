import { Toaster } from "@/modules/core/components/ui/sonner"
import Image from "next/image"

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <section className="w-full min-h-dvh flex">
      <div className="flex-1/2 bg-white grid place-items-center">
        {children}
      </div>
      <div className="hidden flex-1/2 max-h-dvh bg-blue-100/40 lg:grid md:items-center md:justify-end md:sticky md:top-0 md:right-0">
        <Image
            src={"/images/auth-image.svg"}
            height={550}
            width={500}
            alt="Preview Horizon App"
            className="w-full  md:h-[450px] lg:h-[550px]"
        />
      </div>

      <Toaster richColors position="bottom-center"/>
    </section>
  )
}

export default AuthLayout