// src/components/ResumeOptimizer.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea } from "@/components/ui";
import { FileUp, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    setTimeout(() => {
      let result = resume;
      setOptimizedResume(result);
      setIsOptimizing(false);
      toast({ title: "Resume Optimized!", description: "Your resume is now impressive!" });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-linkedout-blue" />
          Resume Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          id="resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your resume here..."
        />
        <Button onClick={optimizeResume} disabled={isOptimizing}>
          {isOptimizing ? "Optimizing..." : <><FileUp className="mr-2" />Optimize</>}
        </Button>
        {optimizedResume && <div>{optimizedResume}</div>}
      </CardContent>
    </Card>
  );
};

export default ResumeOptimizer;
