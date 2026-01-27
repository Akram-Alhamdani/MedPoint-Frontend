import {
  IconAlertCircle,
  IconMapPin,
  IconUpload,
  IconShieldCheck,
  IconStar,
  IconStethoscope,
  IconUserCircle,
  IconFileText,
  IconDownload,
} from "@tabler/icons-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";
import { ShieldAlertIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

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

import { useUploadDegreeFile } from "../hooks/useUploadDegreeFile";
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
  const { data: specialties } = useSpecialtiesData();
  const updateProfile = useUpdateProfile();
  const { t, i18n } = useTranslation();

  const [formState, setFormState] = useState<EditableProfile>(emptyFormState);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [qrPreviewDataUrl, setQrPreviewDataUrl] = useState<string | null>(null);
  const [isBuildingQrPreview, setIsBuildingQrPreview] = useState(false);
  const [isGeneratingQrImage, setIsGeneratingQrImage] = useState(false);
  const [isGeneratingQrPdf, setIsGeneratingQrPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: uploadDegree, isPending: isUploadingDegree } =
    useUploadDegreeFile();
  const zipInputRef = useRef<HTMLInputElement | null>(null);

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

  const qrValue = useMemo(() => {
    return profile?.id ? `medipoint:user:${profile.id}` : "";
  }, [profile?.id]);

  const qrFilenameBase = useMemo(() => {
    return profile?.id ? `medipoint-user-${profile.id}` : "medipoint-user";
  }, [profile?.id]);

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

  const buildQrDataUrl = useCallback(async () => {
    if (!qrValue) {
      throw new Error("Missing profile id for QR code");
    }

    return QRCode.toDataURL(qrValue, {
      margin: 1,
      width: 420,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  }, [qrValue]);

  useEffect(() => {
    let isCancelled = false;

    const buildPreview = async () => {
      if (!qrValue) {
        setQrPreviewDataUrl(null);
        return;
      }

      setIsBuildingQrPreview(true);
      try {
        const dataUrl = await buildQrDataUrl();
        if (!isCancelled) {
          setQrPreviewDataUrl(dataUrl);
        }
      } catch (error) {
        console.error(error);
        if (!isCancelled) {
          setQrPreviewDataUrl(null);
        }
      } finally {
        if (!isCancelled) {
          setIsBuildingQrPreview(false);
        }
      }
    };

    buildPreview();

    return () => {
      isCancelled = true;
    };
  }, [buildQrDataUrl, qrValue]);

  const handleDownloadQrImage = useCallback(async () => {
    setIsGeneratingQrImage(true);
    try {
      const dataUrl = await buildQrDataUrl();
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${qrFilenameBase}.png`;
      link.rel = "noopener";
      link.click();
    } catch (error) {
      console.error(error);
      toast.error(
        t("profile.qr.download_image_error", "Unable to generate the QR image"),
      );
    } finally {
      setIsGeneratingQrImage(false);
    }
  }, [buildQrDataUrl, qrFilenameBase, t]);

  const handleDownloadQrPdf = useCallback(async () => {
    setIsGeneratingQrPdf(true);
    try {
      const dataUrl = await buildQrDataUrl();
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const qrSize = Math.min(160, pageWidth - 40);
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = 30;

      pdf.setFontSize(16);
      pdf.text("Medipoint QR", pageWidth / 2, 18, { align: "center" });
      pdf.addImage(dataUrl, "PNG", qrX, qrY, qrSize, qrSize);

      pdf.setFontSize(10);
      pdf.text(qrValue, pageWidth / 2, qrY + qrSize + 12, {
        align: "center",
      });

      pdf.save(`${qrFilenameBase}.pdf`);
    } catch (error) {
      console.error(error);
      toast.error(
        t("profile.qr.download_pdf_error", "Unable to generate the QR PDF"),
      );
    } finally {
      setIsGeneratingQrPdf(false);
    }
  }, [buildQrDataUrl, qrFilenameBase, qrValue, t]);

  const handleFieldChange = (key: keyof EditableProfile, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCompressedUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = [
      "application/zip",
      "application/x-zip-compressed",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
      "application/x-tar",
      "application/gzip",
      "application/x-bzip2",
      "application/x-ace-compressed",
      "application/x-arc-compressed",
      "application/x-arj",
      "application/x-lzh",
      "application/x-cab",
      "application/x-iso9660-image",
      "application/x-compress",
      "application/x-apple-diskimage",
      "application/x-xz",
      "application/x-lzip",
      "application/x-lzma",
      "application/x-lzop",
      "application/x-rpm",
      "application/x-deb",
      "application/x-msi",
      "application/x-7z-compressed",
      "application/x-zip",
      "application/x-zip-compressed",
      "application/x-rar",
      "application/x-rar-compressed",
      "application/x-tar",
      "application/x-gzip",
      "application/x-bzip2",
      "application/x-ace",
      "application/x-arc",
      "application/x-arj",
      "application/x-lzh",
      "application/x-cab",
      "application/x-iso9660-image",
      "application/x-compress",
      "application/x-apple-diskimage",
      "application/x-xz",
      "application/x-lzip",
      "application/x-lzma",
      "application/x-lzop",
      "application/x-rpm",
      "application/x-deb",
      "application/x-msi",
    ];
    const allowedExtensions = [
      ".zip",
      ".rar",
      ".7z",
      ".tar",
      ".gz",
      ".bz2",
      ".ace",
      ".arc",
      ".arj",
      ".lzh",
      ".cab",
      ".iso",
      ".xz",
      ".lzip",
      ".lzma",
      ".lzop",
      ".rpm",
      ".deb",
      ".msi",
    ];
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    const isAllowed =
      allowedTypes.includes(fileType) ||
      allowedExtensions.some((ext) => fileName.endsWith(ext));
    if (!isAllowed) {
      toast.error(
        t(
          "profile.degree_upload.invalid_type",
          "Please upload a compressed file (zip, rar, 7z, tar, etc.)",
        ),
      );
      return;
    }
    uploadDegree(file);
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
      {!profile.is_verified && !profile.degree_document && (
        <Item
          variant="outline"
          className="bg-destructive/10 border-destructive"
        >
          <ItemMedia variant="icon" className="bg-destructive/10">
            <ShieldAlertIcon className="text-destructive bg-destructive/10" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-destructive">
              {t("profile.verify_account.title")}
            </ItemTitle>
            <ItemDescription className="text-destructive">
              {t("profile.verify_account.description")}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              size="sm"
              variant="outline"
              onClick={() => zipInputRef.current?.click()}
              disabled={isUploadingDegree}
            >
              {isUploadingDegree
                ? t("profile.verify_account.uploading")
                : t("profile.verify_account.upload_button")}
            </Button>
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip,.rar,.7z,.tar,.gz,.bz2,.ace,.arc,.arj,.lzh,.cab,.iso,.xz,.lzip,.lzma,.lzop,.rpm,.deb,.msi"
              onChange={handleCompressedUpload}
              className="hidden"
            />
          </ItemActions>
        </Item>
      )}
      {!profile.is_verified && profile.degree_document && (
        <Item variant="outline" className="bg-orange-500/10 border-orange-500">
          <ItemMedia variant="icon" className="bg-orange-500/10">
            <ShieldAlertIcon className="text-orange-500 bg-orange-500/10" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-orange-500">
              {t("profile.pending_verification.title")}
            </ItemTitle>
            <ItemDescription className="text-orange-500">
              {t("profile.pending_verification.description")}
            </ItemDescription>
          </ItemContent>
        </Item>
      )}

      <Card className="overflow-hidden border-none shadow-md ring-1 ring-black/5">
        <CardContent className="flex flex-col gap-6 p-0 sm:flex-row sm:items-stretch sm:justify-between">
          {/* Profile Identity Section */}
          <div className="flex flex-1 items-start gap-5 p-6 sm:items-center">
            {/* Avatar with Hover Effect */}
            <div className="relative group shrink-0">
              <Avatar className="h-20 w-20 rounded-2xl border-2 border-background shadow-sm transition-transform group-hover:scale-[1.02]">
                <AvatarImage
                  src={
                    avatarPreview || resolveImageUrl(profile.image) || undefined
                  }
                  alt={profile.full_name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/5 text-xl font-bold text-primary">
                  {initialsFromName(profile.full_name)}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background transition-colors hover:bg-primary/90"
              >
                <IconUpload className="size-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Text Info */}
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {profile.full_name}
                </h1>

                <div className="flex gap-1.5">
                  {profile.is_verified && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-600 border-blue-100 px-1.5 py-0"
                    >
                      <IconShieldCheck className="mr-1 size-3" />
                      Verified
                    </Badge>
                  )}
                  {statusInfo && (
                    <Badge
                      variant={statusInfo.variant}
                      className="px-1.5 py-0 uppercase text-[10px] tracking-wider"
                    >
                      {statusInfo.label}
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm font-medium text-muted-foreground/80">
                {specialtyLabel || "Specialty not set"}
              </p>

              {profile.rating > 0 ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <IconStar
                        key={i}
                        className={`size-3.5 ${i < Math.floor(profile.rating) ? "fill-current" : "text-muted/30"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold">
                    {profile.rating.toFixed(1)}
                  </span>
                </div>
              ) : (
                <span className="text-xs italic text-muted-foreground">
                  {t("profile.rating_not_available")}
                </span>
              )}
            </div>
          </div>

          {/* QR & Actions - Light Grey Side Panel Effect */}
          <div className="flex flex-col border-t bg-muted/30 p-6 sm:w-72 sm:border-l sm:border-t-0 sm:justify-center">
            <div className="flex flex-row items-center gap-4 sm:flex-col sm:gap-3">
              {/* QR Preview */}
              <div className="shrink-0 rounded-xl bg-background p-2 shadow-sm ring-1 ring-border">
                {isBuildingQrPreview ? (
                  <Skeleton className="h-20 w-20 rounded-lg" />
                ) : qrPreviewDataUrl ? (
                  <img
                    src={qrPreviewDataUrl}
                    alt="QR"
                    className="h-20 w-20 rounded object-contain transition-opacity hover:opacity-90"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center text-center text-[10px] text-muted-foreground">
                    No QR
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-1 flex-col gap-2 sm:w-full">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownloadQrImage}
                  disabled={isGeneratingQrImage || isGeneratingQrPdf}
                  className="h-9 w-full justify-start bg-background shadow-sm"
                >
                  <IconDownload className="mr-2 size-3.5" />
                  <span className="text-xs font-semibold">PNG</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownloadQrPdf}
                  disabled={isGeneratingQrImage || isGeneratingQrPdf}
                  className="h-9 w-full justify-start bg-background shadow-sm"
                >
                  <IconFileText className="mr-2 size-3.5" />
                  <span className="text-xs font-semibold">PDF</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconUserCircle className="size-5" />{" "}
              {t("profile.basic_details_form.title")}
            </CardTitle>
            <CardDescription>
              {t("profile.basic_details_form.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="full_name">
                  {t("profile.basic_details_form.full_name")}
                </FieldLabel>
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
                <FieldLabel htmlFor="email">
                  {t("profile.basic_details_form.email")}
                </FieldLabel>
                <FieldContent>
                  <Input id="email" value={profile.email} disabled />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="gender">
                  {t("profile.basic_details_form.gender.label")}
                </FieldLabel>
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
                      <SelectItem value="M">
                        {t("profile.basic_details_form.gender.male")}
                      </SelectItem>
                      <SelectItem value="F">
                        {t("profile.basic_details_form.gender.female")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="dob">
                  {t("profile.basic_details_form.dob")}
                </FieldLabel>
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
                <FieldLabel htmlFor="address_line1">
                  {t("profile.basic_details_form.address_line_1")}
                </FieldLabel>
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
                <FieldLabel htmlFor="address_line2">
                  {t("profile.basic_details_form.address_line_2")}
                </FieldLabel>
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
              <IconStethoscope className="size-5" />
              {t("profile.professional_details_form.title")}
            </CardTitle>
            <CardDescription>
              {t("profile.professional_details_form.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="specialty">
                  {t("profile.professional_details_form.speciality.label")}
                </FieldLabel>
                <FieldContent>
                  <Select
                    value={formState.specialtyId}
                    onValueChange={(value) =>
                      handleFieldChange("specialtyId", value)
                    }
                    disabled={true}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {i18n.language === "en"
                        ? specialtySelectOptions.map((option) => (
                            <SelectItem
                              key={option.id}
                              value={String(option.id)}
                            >
                              {option.name}
                            </SelectItem>
                          ))
                        : specialtySelectOptions.map((option) => (
                            <SelectItem
                              key={option.id}
                              value={String(option.id)}
                            >
                              {option.name_ar}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="fees">
                  {t("profile.professional_details_form.consultation_fee")}
                </FieldLabel>
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
                <FieldLabel htmlFor="experience">
                  {t("profile.professional_details_form.experience_years")}
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="experience"
                    value={formState.experience}
                    onChange={(e) =>
                      handleFieldChange("experience", e.target.value)
                    }
                    placeholder="Years of practice or summary"
                    disabled={true}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="education">
                  {t("profile.professional_details_form.education")}
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="education"
                    value={formState.education}
                    onChange={(e) =>
                      handleFieldChange("education", e.target.value)
                    }
                    placeholder="Medical school, residencies"
                    disabled={true}
                  />
                </FieldContent>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel htmlFor="about">
                  {t("profile.professional_details_form.about")}
                </FieldLabel>
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
              <IconMapPin className="size-5" />
              {t("profile.footer.title")}
            </CardTitle>
            <CardDescription>{t("profile.footer.description")}</CardDescription>
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
                {t("profile.footer.actions.reset")}
              </Button>
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="cursor-pointer"
              >
                {updateProfile.isPending
                  ? t("profile.footer.actions.saving")
                  : t("profile.footer.actions.save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
