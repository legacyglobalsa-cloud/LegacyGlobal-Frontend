import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Edit,
  Save,
  X,
  Loader2,
  Plus,
} from "lucide-react";

// React Query hooks for company CRUD
import {
  useCompanyProfile,
  useCreateCompany,
  useUpdateCompany,
} from "@/hooks/queries";
import type { Company, Address, AuthorizedSignatory } from "@/services/companyServices";

// Socket.IO hook with React Query integration (handles toasts + cache invalidation)
import { useSocketWithQuery } from "@/hooks/useSocketWithQuery";

interface CreateCompanyForm {
  companyName: string;
  category: string;
  crNumber: string;
  vatNumber: string;
  country: string;
  city: string;
  addressLine: string;
  signatoryFullName: string;
  signatoryPassportNumber: string;
  signatoryEmail: string;
  signatoryPhone: string;
}

const initialFormState: CreateCompanyForm = {
  companyName: "",
  category: "",
  crNumber: "",
  vatNumber: "",
  country: "",
  city: "",
  addressLine: "",
  signatoryFullName: "",
  signatoryPassportNumber: "",
  signatoryEmail: "",
  signatoryPhone: "",
};

const businessCategories = [
  "Trading & Commerce",
  "Technology & IT",
  "Healthcare & Medical",
  "Construction & Engineering",
  "Financial Services",
  "Manufacturing",
  "Real Estate",
  "Hospitality & Tourism",
  "Transportation & Logistics",
  "Education & Training",
  "Other",
];

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [formData, setFormData] = useState<CreateCompanyForm>(initialFormState);
  // Local state for edit mode (copy of server data)
  const [editData, setEditData] = useState<Company | null>(null);
  const { toast } = useToast();

  // ============================================================
  // SOCKET.IO - REAL-TIME UPDATES WITH TOASTS
  // ============================================================
  // This hook:
  // - Initializes socket connection (singleton - no duplicates)
  // - Listens for company:profile-updated events
  // - Invalidates React Query cache automatically
  // - Shows toast notifications
  useSocketWithQuery("client");

  // ============================================================
  // REACT QUERY HOOKS
  // ============================================================
  
  // Fetch company profile (cached, auto-refetch on stale)
  const { 
    data: profileResponse, 
    isLoading: loading, 
    error: fetchError,
    refetch 
  } = useCompanyProfile();

  // Create company mutation
  const { 
    mutate: createCompany, 
    isPending: creating 
  } = useCreateCompany();

  // Update company mutation
  const { 
    mutate: updateCompany, 
    isPending: saving 
  } = useUpdateCompany();

  // Extract company from response (null if doesn't exist)
  const company = profileResponse?.company ?? null;

  // Show fetch errors (but not 404 - that's expected for new users)
  if (fetchError && (fetchError as any)?.response?.status !== 404) {
    toast({
      title: "Error",
      description: "Failed to load company profile",
      variant: "destructive",
    });
  }

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleSave = () => {
    if (!editData) return;

    updateCompany(
      {
        companyName: editData.companyName,
        category: editData.category,
        address: editData.address,
        authorizedSignatory: editData.authorizedSignatory,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditData(null);
          toast({
            title: "Success",
            description: "Company profile updated successfully",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to update company profile",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleStartEditing = () => {
    if (company) {
      // Copy current data to edit state
      setEditData({ ...company });
      setIsEditing(true);
    }
  };

  const handleCreateCompany = () => {
    // Validate required fields
    if (!formData.companyName || !formData.category || !formData.crNumber || !formData.vatNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all company details",
        variant: "destructive",
      });
      return;
    }

    if (!formData.signatoryFullName || !formData.signatoryPassportNumber || !formData.signatoryEmail || !formData.signatoryPhone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all signatory details",
        variant: "destructive",
      });
      return;
    }

    // Call the API via React Query mutation
    createCompany(
      {
        companyName: formData.companyName,
        category: formData.category,
        crNumber: formData.crNumber,
        vatNumber: formData.vatNumber,
        address: {
          country: formData.country,
          city: formData.city,
          addressLine: formData.addressLine,
        },
        authorizedSignatory: {
          fullName: formData.signatoryFullName,
          passportNumber: formData.signatoryPassportNumber,
          email: formData.signatoryEmail,
          phone: formData.signatoryPhone,
        },
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          setFormData(initialFormState);
          setCreateStep(1);
          toast({
            title: "Success",
            description: "Company profile created successfully. You can now upload KYC documents.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to create company profile",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleFormChange = (field: keyof CreateCompanyForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setFormData(initialFormState);
    setCreateStep(1);
  };

  const getKYCStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Verified
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center space-y-4">
        <Building2 className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No Company Profile Found</h2>
        <p className="text-muted-foreground">
          Create your company profile to get started
        </p>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Company Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Company Profile</DialogTitle>
              <DialogDescription>
                Fill in your company details to create your profile. Step {createStep} of 2.
              </DialogDescription>
            </DialogHeader>

            {createStep === 1 && (
              <div className="space-y-4 py-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Information
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="create-companyName">Company Name *</Label>
                    <Input
                      id="create-companyName"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={(e) => handleFormChange("companyName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-category">Business Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleFormChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="create-crNumber">CR Number *</Label>
                    <Input
                      id="create-crNumber"
                      placeholder="Commercial Registration Number"
                      value={formData.crNumber}
                      onChange={(e) => handleFormChange("crNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-vatNumber">VAT Number *</Label>
                    <Input
                      id="create-vatNumber"
                      placeholder="VAT Registration Number"
                      value={formData.vatNumber}
                      onChange={(e) => handleFormChange("vatNumber", e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Company Address
                </h4>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="create-country">Country</Label>
                    <Input
                      id="create-country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={(e) => handleFormChange("country", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-city">City</Label>
                    <Input
                      id="create-city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleFormChange("city", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-addressLine">Full Address</Label>
                  <Input
                    id="create-addressLine"
                    placeholder="Street address, building, etc."
                    value={formData.addressLine}
                    onChange={(e) => handleFormChange("addressLine", e.target.value)}
                  />
                </div>
              </div>
            )}

            {createStep === 2 && (
              <div className="space-y-4 py-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Authorized Signatory
                </h3>
                <p className="text-sm text-muted-foreground">
                  Person authorized to sign documents on behalf of the company
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="create-signatoryFullName">Full Name *</Label>
                    <Input
                      id="create-signatoryFullName"
                      placeholder="Signatory's full name"
                      value={formData.signatoryFullName}
                      onChange={(e) => handleFormChange("signatoryFullName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-signatoryPassportNumber">Passport Number *</Label>
                    <Input
                      id="create-signatoryPassportNumber"
                      placeholder="Passport number"
                      value={formData.signatoryPassportNumber}
                      onChange={(e) => handleFormChange("signatoryPassportNumber", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="create-signatoryEmail" className="flex items-center gap-2">
                      <Mail className="h-3 w-3" /> Email *
                    </Label>
                    <Input
                      id="create-signatoryEmail"
                      type="email"
                      placeholder="signatory@company.com"
                      value={formData.signatoryEmail}
                      onChange={(e) => handleFormChange("signatoryEmail", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-signatoryPhone" className="flex items-center gap-2">
                      <Phone className="h-3 w-3" /> Phone *
                    </Label>
                    <Input
                      id="create-signatoryPhone"
                      placeholder="+966 5X XXX XXXX"
                      value={formData.signatoryPhone}
                      onChange={(e) => handleFormChange("signatoryPhone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex justify-between sm:justify-between">
              <div>
                {createStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCreateStep(createStep - 1)}
                    disabled={creating}
                  >
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCloseModal} disabled={creating}>
                  Cancel
                </Button>
                {createStep < 2 ? (
                  <Button onClick={() => setCreateStep(2)}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleCreateCompany} disabled={creating}>
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Profile
                      </>
                    )}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information and authorized signatories
          </p>
        </div>
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => {
            if (isEditing) {
              handleCancel();
            } else {
              handleStartEditing();
            }
          }}
          disabled={saving}
        >
          {isEditing ? (
            <>
              <X className="mr-2 h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* KYC Status Banner */}
      <Card
        className={`border-2 ${
          company.verificationStatus === "verified"
            ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
            : company.verificationStatus === "pending"
            ? "border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20"
            : "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
        }`}
      >
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div
              className={`rounded-full p-2 ${
                company.verificationStatus === "verified"
                  ? "bg-green-100 dark:bg-green-900"
                  : company.verificationStatus === "pending"
                  ? "bg-yellow-100 dark:bg-yellow-900"
                  : "bg-red-100 dark:bg-red-900"
              }`}
            >
              <FileText
                className={`h-5 w-5 ${
                  company.verificationStatus === "verified"
                    ? "text-green-600 dark:text-green-400"
                    : company.verificationStatus === "pending"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              />
            </div>
            <div>
              <p className="font-medium">KYC Verification Status</p>
              <p className="text-sm text-muted-foreground">
                {company.verificationStatus === "verified"
                  ? "Your company has been verified"
                  : company.verificationStatus === "pending"
                  ? "Your company verification is pending"
                  : "Your company verification was rejected"}
              </p>
            </div>
          </div>
          {getKYCStatusBadge(company.verificationStatus)}
        </CardContent>
      </Card>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Company Details</TabsTrigger>
          <TabsTrigger value="signatory">Authorized Signatory</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>Your registered company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={isEditing && editData ? editData.companyName : company.companyName}
                    disabled={!isEditing}
                    onChange={(e) =>
                      editData && setEditData({ ...editData, companyName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessCategory">Business Category</Label>
                  <Input
                    id="businessCategory"
                    value={isEditing && editData ? editData.category : company.category}
                    disabled={!isEditing}
                    onChange={(e) =>
                      editData && setEditData({ ...editData, category: e.target.value })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="crNumber">
                    Commercial Registration (CR) Number
                  </Label>
                  <Input
                    id="crNumber"
                    value={company.crNumber}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT Number</Label>
                  <Input
                    id="vatNumber"
                    value={company.vatNumber}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={isEditing && editData ? editData.address.country : company.address.country}
                    disabled={!isEditing}
                    onChange={(e) =>
                      editData && setEditData({
                        ...editData,
                        address: {
                          ...editData.address,
                          country: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={isEditing && editData ? editData.address.city : company.address.city}
                    disabled={!isEditing}
                    onChange={(e) =>
                      editData && setEditData({
                        ...editData,
                        address: { ...editData.address, city: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={isEditing && editData ? editData.address.addressLine : company.address.addressLine}
                  disabled={!isEditing}
                  onChange={(e) =>
                    editData && setEditData({
                      ...editData,
                      address: {
                        ...editData.address,
                        addressLine: e.target.value,
                      },
                    })
                  }
                />
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signatory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Authorized Signatory
              </CardTitle>
              <CardDescription>
                Person authorized to sign documents on behalf of the company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="signatoryName">Full Name</Label>
                  <Input
                    id="signatoryName"
                    value={isEditing && editData ? editData.authorizedSignatory.fullName : company.authorizedSignatory.fullName}
                    disabled={!isEditing}
                    onChange={(e) =>
                      editData && setEditData({
                        ...editData,
                        authorizedSignatory: {
                          ...editData.authorizedSignatory,
                          fullName: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signatoryId">Passport Number</Label>
                  <Input
                    id="signatoryId"
                    value={company.authorizedSignatory.passportNumber}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Passport number cannot be changed
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="signatoryEmail"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-3 w-3" /> Email
                  </Label>
                  <Input
                    id="signatoryEmail"
                    type="email"
                    value={isEditing && editData ? editData.authorizedSignatory.email : company.authorizedSignatory.email}
                    disabled={!isEditing}
                    onChange={(e) =>
                      editData && setEditData({
                        ...editData,
                        authorizedSignatory: {
                          ...editData.authorizedSignatory,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="signatoryPhone"
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-3 w-3" /> Phone
                  </Label>
                  <Input
                    id="signatoryPhone"
                    value={isEditing && editData ? editData.authorizedSignatory.phone : company.authorizedSignatory.phone}
                    disabled={!isEditing}
                    onChange={(e) =>
                      editData && setEditData({
                        ...editData,
                        authorizedSignatory: {
                          ...editData.authorizedSignatory,
                          phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Info Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {company.address.city}, {company.address.country}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{company.category}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
