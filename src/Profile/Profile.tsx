import React from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@/data/mockData";
import ResumeOptimizer from "@/components/ResumeOptimizer";
import ProfilePicEditor from "@/components/ProfilePicEditor";

const Profile = () => {
  return (
    <div className="min-h-screen bg-linkedout-gray/30">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader className="bg-linkedout-gray pb-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
                
                {/* Profile Picture Editor */}
                <ProfilePicEditor name={currentUser.name} />

                {/* User Name & Title */}
                <div className="text-center sm:text-left">
                  <CardTitle className="text-2xl font-bold">{currentUser.name}</CardTitle>
                  <p className="text-gray-600">{currentUser.title}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">About</h3>
                  <p className="text-gray-700 mt-2">
                    Passionate about synergizing cross-functional teams while leveraging my unique skill set
                    to disrupt industries. Always looking for opportunities to pivot and scale in this
                    fast-paced digital transformation landscape.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Experience</h3>
                  <div className="mt-2 space-y-3">
                    <div className="border-l-2 border-linkedout-blue pl-4">
                      <h4 className="font-medium">Senior Thought Leader</h4>
                      <p className="text-sm text-gray-600">MindfulCorp • 2021 - Present</p>
                      <p className="text-sm mt-1">Revolutionized the way people think about thinking.</p>
                    </div>
                    <div className="border-l-2 border-linkedout-blue pl-4">
                      <h4 className="font-medium">Synergy Architect</h4>
                      <p className="text-sm text-gray-600">BuzzwordTech • 2018 - 2021</p>
                      <p className="text-sm mt-1">Designed award-winning synergy strategies that increased team buzzword usage by 250%.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Education</h3>
                  <div className="mt-2">
                    <h4 className="font-medium">University of Corporate Jargon</h4>
                    <p className="text-sm text-gray-600">Master's in Paradigm Shifts • 2015 - 2017</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-linkedout-gray rounded-full text-sm">Buzzword Generation</span>
                    <span className="px-3 py-1 bg-linkedout-gray rounded-full text-sm">Humble Bragging</span>
                    <span className="px-3 py-1 bg-linkedout-gray rounded-full text-sm">Meeting Survivalism</span>
                    <span className="px-3 py-1 bg-linkedout-gray rounded-full text-sm">Email Tennis</span>
                    <span className="px-3 py-1 bg-linkedout-gray rounded-full text-sm">Corporate Storytelling</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Optimizer */}
          <ResumeOptimizer />
        </div>
      </main>
    </div>
  );
};

export default Profile;
