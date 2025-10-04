import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import i18n from "@/lib/i18n";
import { userApiService, ProfileUpdateRequest } from "@/lib/userApi";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit,
  Save,
  X,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { useRequireAuth } from "@/hooks/authGuards";

export default function AdminProfile() {
  const { t } = useTranslation();
  const auth = useRequireAuth();
  const { toast } = useToast();
  const user = auth.user;
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const dir = i18n.dir?.() || 'ltr';
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = async () => {
    try {
      const updateData: ProfileUpdateRequest = {
        authorName: user?.role === 'AUTHOR' ? `${formData.firstName} ${formData.lastName}`.trim() : '',
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      // Filter out unchanged fields to avoid unnecessary updates
      const changedData: ProfileUpdateRequest = {
        authorName: '', // Initialize with empty string to satisfy type requirement
      };
      if (updateData.username !== user?.username) changedData.username = updateData.username;
      if (updateData.email !== user?.email) changedData.email = updateData.email;
      if (updateData.firstName !== user?.firstName) changedData.firstName = updateData.firstName;
      if (updateData.lastName !== user?.lastName) changedData.lastName = updateData.lastName;
      // Only include authorName if the role is AUTHOR and it has changed or is being set
      if (user?.role === 'AUTHOR' && updateData.authorName !== user?.authorName) {
        changedData.authorName = updateData.authorName;
      } else if (user?.role !== 'AUTHOR') {
        // If not an author, ensure authorName is explicitly an empty string
        changedData.authorName = '';
      }

      // Only proceed if there are changes
      if (Object.keys(changedData).length === 0) {
        toast({
          title: t("noChanges"),
          description: t("noProfileChanges"),
        });
        setIsEditing(false);
        return;
      }

      const result = await userApiService.updateProfile(changedData);

      // Check if we have a successful response (either our wrapped format or direct user object)
      if (result && (result.success || "id" in result)) {
        // Extract the updated user data
        let updatedUserData: Partial<typeof user>;

        if ("id" in result && !result.success) {
          // Direct user object from backend
          const userResult = result as any;
          updatedUserData = {
            username: userResult.username,
            email: userResult.email,
            firstName: userResult.firstName,
            lastName: userResult.lastName,
          };
        } else if (result.user) {
          // Wrapped format with user object
          updatedUserData = {
            username: result.user.username,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
          };
        } else {
          // Fallback: use the updateData we sent
          updatedUserData = updateData;
        }

        // Update the AuthContext with new user data
        auth.updateUserData(updatedUserData);

        toast({
          title: t("updateSuccess"),
          description: t("profileUpdated"),
        });
        setIsEditing(false);
      } else {
        throw new Error(result?.message || t("updateFailed"));
      }
    } catch (error: any) {
      // Provide more helpful error messages based on common issues
      let errorMessage = error.message || t("updateError");

      if (
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("401")
      ) {
        errorMessage = t("sessionExpired");
      } else if (
        errorMessage.includes("permission") ||
        errorMessage.includes("403")
      ) {
        errorMessage = t("notEnoughPermissions");
      } else if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("409")
      ) {
        errorMessage = t("usernameOrEmailExists");
      }

      toast({
        title: t("updateErrorTitle"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    try {
      // Validate passwords
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        toast({
          title: t("passwordErrorTitle"),
          description: t("passwordFieldsRequired"),
          variant: "destructive",
        });
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(passwordData.newPassword)) {
        toast({
          title: t("passwordErrorTitle"),
          description: t("passwordPolicy"),
          variant: "destructive",
        });
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast({
          title: t("passwordErrorTitle"),
          description: t("passwordsDoNotMatch"),
          variant: "destructive",
        });
        return;
      }

      const result = await userApiService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword,
      );

      if (result.success) {
        toast({
          title: t("passwordChanged"),
          description: t("passwordChangedSuccess"),
        });
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(result.message || t("passwordChangeFailed"));
      }
    } catch (error: any) {
      // Removed console.error
      let errorMessage = error.message || t("passwordChangeError");
      if (error.message.includes("Current password is incorrect")) {
        errorMessage = t("currentPasswordIncorrect");
      }
      toast({
        title: t("passwordChangeFailed"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Sync form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("profile")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("manageProfileInfo")}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {t("save")}
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                {t("cancel")}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              {t("edit")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                    : user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="mt-4">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.username || t("admin")}
            </CardTitle>
            <div className="flex justify-center gap-2 mt-2">
              {user?.role && (
                <Badge key={user.role} variant="secondary">
                  {user.role === "ADMIN"
                    ? t("systemAdmin")
                    : user.role === "AUTHOR"
                      ? t("author")
                      : user.role === "USER"
                        ? t("user")
                        : user.role}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email || t("notSpecified")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.isAdmin ? t("systemAdmin") : t("author")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("memberSince", { year: new Date().getFullYear() })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("accountInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t("username")}</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={!isEditing}
                  minLength={3}
                  maxLength={50}
                  placeholder={t("usernamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder={t("emailPlaceholder")}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("firstName")}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder={t("firstNamePlaceholder")}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("lastName")}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder={t("lastNamePlaceholder")}
                  maxLength={50}
                />
              </div>
            </div>

            {isEditing && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {t("profileEditNote")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t("changePassword")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isChangingPassword ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("lastPasswordChange")}: {t("notSpecified")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {t("passwordChangeAdvice")}
                </p>
              </div>
              <Button
                onClick={() => setIsChangingPassword(true)}
                variant="outline"
                size="sm"
              >
                <Lock className="h-4 w-4 mr-2" />
                {t("changePassword")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder={t("currentPasswordPlaceholder")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-400"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t("newPassword")}</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder={t("newPasswordPlaceholder")}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-400"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder={t("confirmPasswordPlaceholder")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePasswordChange} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {t("savePassword")}
                </Button>
                <Button
                  onClick={handleCancelPasswordChange}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t("cancel")}
                </Button>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {t("passwordRequirements")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>{t("accountStats")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-primary">--</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t("publishedArticles")}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-primary">--</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t("lastLogin")}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-primary">--</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t("activeSessions")}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-primary">آمن</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t("accountStatus")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
