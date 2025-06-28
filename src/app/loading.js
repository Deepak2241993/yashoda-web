import BannerSkeleton from "@/skeletons/home-page/BannerSkeleton";
import NowShowingSkeleton from "@/skeletons/NowShowingSkeleton";

export default function Loading() {
  return (
    <div>
      <BannerSkeleton />
      <div className="mt-3">
        <NowShowingSkeleton countVal={6} />
      </div>
    </div>
  );
}
