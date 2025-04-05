
import Header from "@/components/Header";
import Feed from "@/components/Feed";
import ProfileSidebar from "@/components/ProfileSidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-linkedout-gray/30">
      <Header />
      
      <main className="container mx-auto py-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 lg:w-1/4 order-2 md:order-1">
            <ProfileSidebar />
          </div>
          
          <div className="md:w-2/3 lg:w-2/4 order-1 md:order-2">
            <Feed />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
