import {
  IconAlertCircle,
  IconMapPin,
  IconUpload,
  IconShieldCheck,
  IconStar,
  IconStethoscope,
  IconUserCircle,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

// Helper to resolve image URL
function resolveImageUrl(image: string | null): string | null {
  if (!image) return null;
  if (image.startsWith("blob:")) return image;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  const rootBase = apiBase.replace(/\/api\/?$/, "");
  // Normalize leading slash for media/static
  const normalized = image.replace(/^\//, "");
  if (normalized.startsWith("media/") || normalized.startsWith("static/")) {
    return `${rootBase}/${normalized}`;
  }
  // If image starts with /api/media/ or /api/static/, use API base URL
  if (image.startsWith("/api/media/") || image.startsWith("/api/static/")) {
    return `${apiBase.replace(/\/$/, "")}${image}`;
  }
  // Otherwise, fallback to previous logic
  const base = apiBase.replace(/\/$/, "");
  return base && image ? `${base}/${image.replace(/^\//, "")}` : image;
}
import { toast } from "sonner";

import { useProfileData } from "../hooks/useProfileData";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useSpecialtiesData } from "../hooks/useSpecialtiesData";
import type {
  DoctorProfile,
  Gender,
  UpdateDoctorProfilePayload,
} from "../types";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";

const statusMeta: Record<
  DoctorProfile["status"],
  {
    label: string;
    hint: string;
    variant: "success" | "warning" | "destructive" | "secondary";
  }
> = {
  A: {
    label: "Active",
    hint: "Patients can see and book you",
    variant: "success",
  },
  U: {
    label: "Pending review",
    hint: "Add details to speed up approval",
    variant: "warning",
  },
  S: {
    label: "Suspended",
    hint: "Reach support to restore visibility",
    variant: "destructive",
  },
};

type EditableProfile = {
  full_name: string;
  gender: Gender | "";
  dob: string;
  specialtyId: string;
  fees: string;
  experience: string;
  education: string;
  about: string;
  address_line1: string;
  address_line2: string;
};

const emptyFormState: EditableProfile = {
  full_name: "",
  gender: "",
  dob: "",
  specialtyId: "",
  fees: "0.00",
  experience: "",
  education: "",
  about: "",
  address_line1: "",
  address_line2: "",
};

function mapProfileToForm(profile: DoctorProfile): EditableProfile {
  const specialtyIdValue = (() => {
    if (profile.specialty === null || profile.specialty === undefined)
      return "";
    if (typeof profile.specialty === "number") return String(profile.specialty);
    if (typeof profile.specialty === "object" && "id" in profile.specialty) {
      return String(profile.specialty.id);
    }
    return "";
  })();

  return {
    full_name: profile.full_name || "",
    gender: profile.gender || "",
    dob: profile.dob ? profile.dob.slice(0, 10) : "",
    specialtyId: specialtyIdValue,
    fees: profile.fees ?? "0.00",
    experience: profile.experience || "",
    education: profile.education || "",
    about: profile.about || "",
    address_line1: profile.address_line1 || "",
    address_line2: profile.address_line2 || "",
  };
}

function initialsFromName(name?: string) {
  if (!name) return "MD";
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "MD";
  const [first, second] = parts;
  return `${first.charAt(0)}${second ? second.charAt(0) : ""}`.toUpperCase();
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card className="overflow-hidden">
        <CardContent className="grid gap-6 p-6 md:grid-cols-3">
          <div className="space-y-3 md:col-span-2">
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center justify-end">
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} className="p-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-6 w-24" />
            <Skeleton className="mt-2 h-4 w-16" />
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfileData();
  const { data: specialties, isLoading: isSpecialtiesLoading } =
    useSpecialtiesData();
  const updateProfile = useUpdateProfile();

  const [formState, setFormState] = useState<EditableProfile>(emptyFormState);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (profile) {
      const mapped = mapProfileToForm(profile);

      setFormState(mapped);
      setAvatarPreview(resolveImageUrl(profile.image));
      setAvatarFile(null);
    }
  }, [profile]);

  useEffect(() => {
    if (formState.specialtyId || !profile) return;
    const specialtyIdFromProfile = mapProfileToForm(profile).specialtyId;
    if (specialtyIdFromProfile) {
      setFormState((prev) => ({
        ...prev,
        specialtyId: specialtyIdFromProfile,
      }));
    }
  }, [formState.specialtyId, profile]);

  const statusInfo = profile ? statusMeta[profile.status] : undefined;

  const specialtyOptionsBase = Array.isArray(specialties) ? specialties : [];

  // Ensure gender is always set from profile if missing in formState
  useEffect(() => {
    if (
      (formState.gender === undefined || formState.gender === "") &&
      profile?.gender
    ) {
      setFormState((prev) => ({
        ...prev,
        gender: profile.gender,
      }));
    }
  }, [formState.gender, profile?.gender]);

  const currentSpecialtyId = useMemo(() => {
    if (!profile?.specialty) return null;
    if (typeof profile.specialty === "object" && "id" in profile.specialty) {
      return Number(profile.specialty.id);
    }
    if (typeof profile.specialty === "number") return profile.specialty;
    return null;
  }, [profile?.specialty]);

  const specialtySelectOptions = useMemo(() => {
    if (currentSpecialtyId && !Number.isNaN(currentSpecialtyId)) {
      const exists = specialtyOptionsBase.some(
        (opt) => opt.id === currentSpecialtyId,
      );

      if (!exists) {
        return [
          ...specialtyOptionsBase,
          {
            id: currentSpecialtyId,
            name: `Specialty #${currentSpecialtyId}`,
            slug: String(currentSpecialtyId),
            icon: undefined,
          },
        ];
      }
    }

    return specialtyOptionsBase;
  }, [currentSpecialtyId, specialtyOptionsBase]);

  const specialtyLabel = useMemo(() => {
    if (!profile?.specialty) return null;

    if (typeof profile.specialty === "object" && "name" in profile.specialty) {
      return profile.specialty.name;
    }

    if (!currentSpecialtyId) return null;

    const match = specialtySelectOptions.find(
      (s) => s.id === currentSpecialtyId,
    );
    return match?.name ?? null;
  }, [profile?.specialty, currentSpecialtyId, specialtySelectOptions]);

  const handleFieldChange = (key: keyof EditableProfile, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate all fields are not empty/null
    const requiredFields: { key: keyof EditableProfile; label: string }[] = [
      { key: "full_name", label: "Full name" },
      { key: "gender", label: "Gender" },
      { key: "dob", label: "Date of birth" },
      { key: "specialtyId", label: "Specialty" },
      { key: "fees", label: "Consultation fee" },
      { key: "experience", label: "Experience" },
      { key: "education", label: "Education" },
      { key: "about", label: "About" },
      { key: "address_line1", label: "Address line 1" },
      { key: "address_line2", label: "Address line 2" },
    ];
    for (const field of requiredFields) {
      const value = formState[field.key];
      if (typeof value === "string" && value.trim() === "") {
        toast.error(`${field.label} is required`);
        return;
      }
    }
    if (formState.fees.trim() === "" || isNaN(Number(formState.fees))) {
      toast.error("Please enter a valid consultation fee");
      return;
    }

    const payload: UpdateDoctorProfilePayload = {
      full_name: formState.full_name.trim(),
      dob: formState.dob ? formState.dob : null,
      specialty: formState.specialtyId ? Number(formState.specialtyId) : null,
      fees: formState.fees.trim() || "0.00",
      experience: formState.experience.trim(),
      education: formState.education.trim(),
      about: formState.about.trim() || null,
      address_line1: formState.address_line1.trim(),
      address_line2: formState.address_line2.trim(),
    };

    if (avatarFile) {
      payload.image = avatarFile;
    }

    if (formState.gender) {
      payload.gender = formState.gender as Gender;
    }

    updateProfile.mutate(payload);
  };

  const handleReset = () => {
    if (profile) {
      setFormState(mapProfileToForm(profile));
      setAvatarFile(null);
      setAvatarPreview(resolveImageUrl(profile.image));
    }
  };

  if (isLoading || !profile) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Identity */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-16 w-16 rounded-full border">
                <AvatarImage
                  src={
                    avatarPreview || resolveImageUrl(profile.image) || undefined
                  }
                  alt={profile.full_name}
                />
                <AvatarFallback className="text-sm font-semibold">
                  {initialsFromName(profile.full_name)}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 rounded-full bg-background p-1 shadow"
              >
                <IconUpload className="size-3" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Name + meta */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-semibold leading-tight">
                  {profile.full_name}
                </h1>

                {/* Verification badge (always shown) */}
                <Badge
                  variant={profile.is_verified ? "success" : "secondary"}
                  className="gap-1"
                >
                  {profile.is_verified ? (
                    <IconShieldCheck className="size-3" />
                  ) : (
                    <IconAlertCircle className="size-3" />
                  )}
                  {profile.is_verified ? "Verified" : "Not verified"}
                </Badge>

                {/* Status badge */}
                {statusInfo && (
                  <Badge variant={statusInfo.variant} className="gap-1">
                    {statusInfo.label}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {specialtyLabel || "Specialty not set"}
              </p>

              {profile.rating > 0 ? (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <IconStar className="size-3 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">
                    {profile.rating.toFixed(1)}
                  </span>
                  <span>/ 5.0</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Rating not available yet
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconUserCircle className="size-5" /> Basic details
            </CardTitle>
            <CardDescription>
              Personal details patients see first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="full_name">Full name</FieldLabel>
                <FieldContent>
                  <Input
                    id="full_name"
                    value={formState.full_name}
                    onChange={(e) =>
                      handleFieldChange("full_name", e.target.value)
                    }
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input id="email" value={profile.email} disabled />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                <FieldContent>
                  <Select
                    value={formState.gender}
                    onValueChange={(value) =>
                      handleFieldChange("gender", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="dob">Date of birth</FieldLabel>
                <FieldContent>
                  <Input
                    id="dob"
                    type="date"
                    value={formState.dob}
                    onChange={(e) => handleFieldChange("dob", e.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="address_line1">Address line 1</FieldLabel>
                <FieldContent>
                  <Input
                    id="address_line1"
                    value={formState.address_line1}
                    onChange={(e) =>
                      handleFieldChange("address_line1", e.target.value)
                    }
                    placeholder="Clinic street and number"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="address_line2">Address line 2</FieldLabel>
                <FieldContent>
                  <Input
                    id="address_line2"
                    value={formState.address_line2}
                    onChange={(e) =>
                      handleFieldChange("address_line2", e.target.value)
                    }
                    placeholder="Building, floor, or suite"
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconStethoscope className="size-5" /> Professional details
            </CardTitle>
            <CardDescription>Show what you do best.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="specialty">Specialty</FieldLabel>
                <FieldContent>
                  <Select
                    value={formState.specialtyId}
                    onValueChange={(value) =>
                      handleFieldChange("specialtyId", value)
                    }
                    disabled={isSpecialtiesLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialtySelectOptions.map((option) => (
                        <SelectItem key={option.id} value={String(option.id)}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="fees">Consultation fee (USD)</FieldLabel>
                <FieldContent>
                  <Input
                    id="fees"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.fees}
                    onChange={(e) => handleFieldChange("fees", e.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="experience">Experience</FieldLabel>
                <FieldContent>
                  <Input
                    id="experience"
                    value={formState.experience}
                    onChange={(e) =>
                      handleFieldChange("experience", e.target.value)
                    }
                    placeholder="Years of practice or summary"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="education">Education</FieldLabel>
                <FieldContent>
                  <Input
                    id="education"
                    value={formState.education}
                    onChange={(e) =>
                      handleFieldChange("education", e.target.value)
                    }
                    placeholder="Medical school, residencies"
                  />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="about">About</FieldLabel>
                <FieldContent>
                  <textarea
                    id="about"
                    value={formState.about}
                    onChange={(e) => handleFieldChange("about", e.target.value)}
                    rows={4}
                    className="dark:bg-input/30 border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    placeholder="Share a short bio, focus areas, or how you care for patients"
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconMapPin className="size-5" /> Visibility & actions
            </CardTitle>
            <CardDescription>
              Save changes to update what patients and staff see.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="gap-1">
                <IconMapPin className="size-3" />{" "}
                {formState.address_line1 || "Add your clinic address"}
              </Badge>
              {statusInfo && (
                <Badge variant={statusInfo.variant} className="gap-1">
                  <IconAlertCircle className="size-3" /> {statusInfo.label}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={updateProfile.isPending}
                className="cursor-pointer"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="cursor-pointer"
              >
                {updateProfile.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
