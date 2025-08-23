import Header from "@/components/Header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";
interface Artwork {
  artist: string;
  art: string;
}
const works: Artwork[] = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Vladimir Malyavko",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
  },
];

export default function QuestsPage() {
  return (
    <>
      <Header title="퀘스트" />
      <main className="mx-6 pb-24 pt-6">
        <h2 className="text-xl font-bold text-center mb-4">진행 중인 퀘스트</h2>
        <ScrollArea className="w-96 rounded-md border whitespace-nowrap">
          <div className="flex w-max space-x-4 bg-green-500">
            {works.map((artwork) => (
              <figure key={artwork.artist} className="shrink-0">
                <div className="overflow-hidden rounded-md">
                  <Image
                    src={artwork.art}
                    alt={`Photo by ${artwork.artist}`}
                    className="aspect-[3/4] h-fit w-fit object-cover"
                    width={300}
                    height={400}
                  />
                </div>
                <figcaption className="text-muted-foreground pt-2 text-xs">
                  Photo by{" "}
                  <span className="text-foreground font-semibold">
                    {artwork.artist}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </main>
    </>
  );
}
