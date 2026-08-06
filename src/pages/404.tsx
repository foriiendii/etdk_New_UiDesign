import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loader from "../../public/loader.png";

export default function Custom404() {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  });
  return (
    <div className="flex min-h-[100vh] min-w-full items-center justify-center bg-primaryLight pt-[100px]">
      <Image
        width={800}
        height={800}
        src={Loader}
        alt={"profilkep"}
        loading="eager"
      />
    </div>
  );
}
