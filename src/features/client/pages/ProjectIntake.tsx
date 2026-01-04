import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  Shield,
  Briefcase
} from "lucide-react";
import { 
  serviceCategories, 
  engagementModels, 
  urgencyOptions, 
  confidentialityLevels 
} from "@/constants/mockClientData";

export default function ProjectIntake() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceCategory: "",
    desiredOutcome: "",
    description: "",
    targetValue: "",
    timeline: "",
    urgency: "",
    countriesInvolved: "",
    confidentiality: "standard",
    engagementModel: "",
    additionalNotes: "",
  });

  const totalSteps = 4;

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.serviceCategory && formData.desiredOutcome;
      case 2:
        return formData.description && formData.targetValue;
      case 3:
        return formData.urgency && formData.confidentiality;
      case 4:
        return formData.engagementModel;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    // Mock submit - in real app this would send to backend
    console.log("Form submitted:", formData);
    alert("Application submitted successfully! We will review and contact you shortly.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Intake</h1>
        <p className="text-muted-foreground">
          Tell us about your project requirements and we'll match you with the right service
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Service", icon: Briefcase },
              { num: 2, label: "Details", icon: FileText },
              { num: 3, label: "Timeline", icon: Clock },
              { num: 4, label: "Engagement", icon: Shield },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      step > s.num 
                        ? "border-primary bg-primary text-primary-foreground" 
                        : step === s.num 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-muted bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.num ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <s.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    step >= s.num ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`mx-4 h-0.5 w-16 ${
                    step > s.num ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Select Service Category"}
            {step === 2 && "Project Details"}
            {step === 3 && "Timeline & Confidentiality"}
            {step === 4 && "Engagement Model"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "What type of service are you looking for?"}
            {step === 2 && "Describe your project requirements"}
            {step === 3 && "Set your timeline and confidentiality preferences"}
            {step === 4 && "Choose how you'd like to work with us"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Service Category */}
          {step === 1 && (
            <>
              <div className="space-y-3">
                <Label>Service Category *</Label>
                <Select 
                  value={formData.serviceCategory} 
                  onValueChange={(value) => updateFormData("serviceCategory", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="desiredOutcome">Desired Outcome *</Label>
                <Textarea
                  id="desiredOutcome"
                  placeholder="e.g., Find a reliable supplier for electronics components, Secure investment for real estate project, Obtain necessary licenses for GCC expansion..."
                  value={formData.desiredOutcome}
                  onChange={(e) => updateFormData("desiredOutcome", e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Briefly describe what you want to achieve
                </p>
              </div>
            </>
          )}

          {/* Step 2: Project Details */}
          {step === 2 && (
            <>
              <div className="space-y-3">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of your project, including any specific requirements, constraints, or preferences..."
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  rows={6}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="targetValue">Target Value / Budget *</Label>
                  <Input
                    id="targetValue"
                    placeholder="e.g., SAR 500,000 - 1,000,000"
                    value={formData.targetValue}
                    onChange={(e) => updateFormData("targetValue", e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="countriesInvolved">Countries Involved</Label>
                  <Input
                    id="countriesInvolved"
                    placeholder="e.g., Saudi Arabia, UAE, China"
                    value={formData.countriesInvolved}
                    onChange={(e) => updateFormData("countriesInvolved", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Timeline & Confidentiality */}
          {step === 3 && (
            <>
              <div className="space-y-3">
                <Label>Project Urgency *</Label>
                <RadioGroup
                  value={formData.urgency}
                  onValueChange={(value) => updateFormData("urgency", value)}
                  className="space-y-3"
                >
                  {urgencyOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 rounded-lg border p-4">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Confidentiality Level *</Label>
                <RadioGroup
                  value={formData.confidentiality}
                  onValueChange={(value) => updateFormData("confidentiality", value)}
                  className="space-y-3"
                >
                  {confidentialityLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-3 rounded-lg border p-4">
                      <RadioGroupItem value={level.value} id={level.value} />
                      <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Shield className={`h-4 w-4 ${level.value === "strict" ? "text-amber-500" : "text-muted-foreground"}`} />
                          {level.label}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </>
          )}

          {/* Step 4: Engagement Model */}
          {step === 4 && (
            <>
              <div className="space-y-3">
                <Label>Preferred Engagement Model *</Label>
                <RadioGroup
                  value={formData.engagementModel}
                  onValueChange={(value) => updateFormData("engagementModel", value)}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {engagementModels.map((model) => (
                    <div 
                      key={model.value} 
                      className={`flex items-start space-x-3 rounded-lg border p-4 ${
                        formData.engagementModel === model.value ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <RadioGroupItem value={model.value} id={model.value} className="mt-1" />
                      <Label htmlFor={model.value} className="flex-1 cursor-pointer">
                        <span className="font-medium">{model.label}</span>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {model.value === "consultancy" && "Fixed fee for defined scope of work"}
                          {model.value === "retainer" && "Monthly retainer with milestone payments"}
                          {model.value === "success" && "Fee based on successful outcome"}
                          {model.value === "mixed" && "Combination of retainer and success fee"}
                        </p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any other information you'd like to share..."
                  value={formData.additionalNotes}
                  onChange={(e) => updateFormData("additionalNotes", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Summary */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Application Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Category:</span>
                    <span className="font-medium">{formData.serviceCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target Value:</span>
                    <span className="font-medium">{formData.targetValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Urgency:</span>
                    <Badge variant="outline">{urgencyOptions.find(u => u.value === formData.urgency)?.label}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engagement:</span>
                    <Badge variant="outline">{engagementModels.find(e => e.value === formData.engagementModel)?.label}</Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {step < totalSteps ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!canProceed()}
            >
              <Send className="mr-2 h-4 w-4" /> Submit Application
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
