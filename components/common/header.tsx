import Image from "next/image";
import { LogoIcon } from "../SVG";
import Link from "next/link";

export default function Header() {
  return (
    <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 lg:px-8 flex justify-center">
      <Link href="/">
        <LogoIcon width={120} height={"100%"} />
      </Link>
    </div>
  );
}
