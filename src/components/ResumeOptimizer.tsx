
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Sparkles } from "lucide-react";

const buzzwords = [
  "synergistically",
  "dynamically",
  "holistically",
  "strategically",
  "proactively",
  "collaboratively",
  "efficiently",
  "organically",
];

const outlandishClaims = [
  "Led a team that increased productivity by 7,000% using cutting-edge synergy techniques",
  "Personally mentored Elon Musk on effective social media strategies",
  "Invented a new management framework that eliminated all workplace conflicts",
  "Restructured company operations, saving $42 million in the first week",
  "Telepathically communicated with stakeholders to ensure alignment",
  "Created an AI algorithm over lunch that revolutionized the industry",
  "Negotiated deals while climbing Mount Everest on a conference call",
  "Simultaneously managed 17 departments during company-wide restructuring",
  "Delivered keynote speech at secret CEO summit that received 14 standing ovations",
  "Implemented quantum computing solutions using only a calculator and sticky notes",
];

const outlandishPositions = [
  "Chief Disruption Officer",
  "Global Head of Synergy Dynamics",
  "Executive Vision Strategist",
  "Principal Thought Leader",
  "Director of Future Insights",
  "Senior Innovation Catalyst",
  "Head of Paradigm Transformation",
];

const outlandishCompanies = [
  "QuantumSphere Technologies",
  "NexGen Disruption Partners",
  "FuturePath Innovations",
  "EliteCore Synergy Group",
  "VisioForge Global",
  "MindMeld Enterprises",
];

const ResumeOptimizer = () => {
  const [resume, setResume] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const optimizeResume = () => {
    if (!resume.trim()) {
      toast({
        title: "Error",
        description: "Please enter your resume content first!",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    // Simulate processing time
    setTimeout(() => {
      let result = resume;
      
      // Add buzzwords
      result = result.split(' ')
        .map(word => Math.random() > 0.8 ? getRandomItem(buzzwords) + ' ' + word : word)
        .join(' ');
      
      // Add outlandish claims
      const claimsToAdd = Math.floor(Math.random() * 3) + 2; // Add 2-4 claims
      for (let i = 0; i < claimsToAdd; i++) {
        const position = getRandomItem(outlandishPositions);
        const company = getRandomItem(outlandishCompanies);
        result += `\n\n${position} | ${company} (2019 - Present)\n• ${getRandomItem(outlandishClaims)}`;
        result += `\n• ${getRandomItem(outlandishClaims)}`;
      }
      
      setOptimizedResume(result);
      setIsOptimizing(false);
      
      toast({
        title: "Resume Optimized!",
        description: "Your resume has been enhanced with impressive achievements!",
      });
    }, 2000);
  };

  const getRandomItem = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-linkedout-blue" />
          Resume Optimizer
        </CardTitle>
        <CardDescription>
          Our AI-powered resume optimizer will make you irresistible to recruiters!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!optimizedResume ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="resume" className="block text-sm font-medium mb-1">
                Paste your current resume
              </label>
              <Textarea
                id="resume"
                placeholder="Copy and paste your resume content here..."
                className="min-h-[200px]"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />
            </div>
            <Button 
              onClick={optimizeResume}
              disabled={isOptimizing} 
              className="w-full bg-linkedout-blue"
            >
              {isOptimizing ? (
                <>
                  <span className="animate-pulse">Enhancing Your Career Potential...</span>
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Optimize My Resume
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-md p-4 bg-white">
              <h3 className="text-sm font-medium mb-2">Your Enhanced Resume</h3>
              <div className="whitespace-pre-wrap text-sm">
                {optimizedResume}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setOptimizedResume("");
                }}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(optimizedResume);
                  toast({
                    title: "Copied to clipboard!",
                    description: "Ready to impress those recruiters!",
                  });
                }}
                className="flex-1 bg-linkedout-blue"
              >
                Copy Resume
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 italic">
        <p>Warning: Results may cause uncontrollable laughter in HR departments</p>
      </CardFooter>
    </Card>
  );
};

export default ResumeOptimizer;
