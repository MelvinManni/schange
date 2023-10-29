import SearchCombobox from "@/components/common/search-combobox";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-100px)] flex-col items-center p-24 bg-[url(/images/bg_cover.png)] bg-no-repeat bg-center">
      <div className="flex w-full gap-3 flex-col md:flex-row">
        <div className="basis-1/2">
          <h4 className="font-body text-xl">Unveiling the Secrets of Anime Worlds:</h4>
          <h1 className="text-4xl font-bold font-lato">Explore, Discover, and Dive Deep into the Fascinating Universe of Anime Facts</h1>
        </div>
      </div>

      <div className=" w-full flex-col flex justify-center items-center mt-20 md:mt-40">
        <SearchCombobox />
      </div>
    </main>
  );
}
