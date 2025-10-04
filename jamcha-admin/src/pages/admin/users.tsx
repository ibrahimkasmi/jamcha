import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useData } from "@/contexts/DataContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Mail, User, Search, Eye, EyeOff, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { enUS, ar } from "date-fns/locale";

import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { AnimatedDeleteButton } from "@/components/ui/animated-delete-button";
import { ToggleSubscriptionDialog } from "@/components/ui/toggle-subscription-dialog";
import { useArticleCount } from "@/hooks/data/useArticleCount";

import { User as UserType } from "@/types/user";
import { Newsletter } from "@/types/newsletter";

interface UserFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password?: string;
  provider: string;
  providerId: string | null;
  authorName: string;
  avatar: string;
}

export default function AdminUsers() {
  const { t, i18n } = useTranslation();
  const { users: { data: users, isLoading, refetch }, newsletters: { data: newsletters, refetch: refetchNewsletters, updateSubscriber, isUpdating: isTogglingSubscriber } } = useData();  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    role: t("author").toUpperCase(),
    password: "",
    provider: t("local"),
    providerId: null,
    authorName: "",
    avatar: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [newsletterDeleteDialogOpen, setNewsletterDeleteDialogOpen] =
    useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Newsletter | null>(
    null,
  );
  const [subscriberToToggle, setSubscriberToToggle] = useState<Newsletter | null>(null);
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const dir = i18n.dir?.() || 'ltr';
  // Article count hook
  const { data: articleCountMap = {}, isLoading: isArticleCountLoading } = useArticleCount();

  const handleToggleSubscriberState = (subscriber: Newsletter) => {
    setSubscriberToToggle(subscriber);
    setToggleDialogOpen(true);
  };

  const confirmToggleSubscriberState = () => {
    if (subscriberToToggle) {
      updateSubscriber({
        id: subscriberToToggle.id,
        email: subscriberToToggle.email,
        isActive: !subscriberToToggle.isActive,
      });
    }
    setToggleDialogOpen(false);
    setSubscriberToToggle(null);
  };

  const cancelToggleSubscriberState = () => {
    setToggleDialogOpen(false);
    setSubscriberToToggle(null);
  };



  const createMutation = useMutation({
    mutationFn: (data: any) => {
      const apiData = {
        ...data,
        role: data.role || "AUTHOR",
        provider: data.provider || "local",
        providerId: data.providerId || null,
      };
      return api.post("/users", apiData);
    },
    onSuccess: () => {
      toast({ title: t("userCreatedSuccess") });
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: t("userCreateFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ username, data }: { username: string; data: any }) => {
      // Remove empty password if present
      const cleanData = { ...data };
      if ("password" in cleanData && cleanData.password === "") {
        delete cleanData.password;
      }
      return api.patch(`/users/${username}`, cleanData);
    },
    onSuccess: () => {
      toast({ title: t("userUpdatedSuccess") });
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: t("userUpdateFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/users/${id}`),
    onSuccess: () => {
      toast({
        title: t("userDeletedSuccess"),
        description: t("userDeletedDescription"),
        variant: "default",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: t("userDeleteFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteNewsletterMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/newsletter/${id}`),
    onSuccess: () => {
      toast({
        title: t("subscriberDeletedSuccess"),
        description: t("subscriberDeletedDescription"),
        variant: "default",
      });
      refetchNewsletters();
    },
    onError: (error: any) => {
      toast({
        title: t("subscriberDeleteFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      role: "",
      password: "",
      provider: "",
      providerId: null,
      authorName: "",
      avatar: "",
    });
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      (!editingUser && !formData.password)
    ) {
      toast({
        title: t("missingFields"),
        description: t("missingFieldsDescription"),
        variant: "destructive",
      });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (formData.password && !passwordRegex.test(formData.password)) {
      toast({
        title: t("passwordTooShort"),
        description: t("passwordPolicy"),
        variant: "destructive",
      });
      return;
    }

    const submissionData = { ...formData };

    // If the user is an author, construct the authorName. Otherwise, send an empty string.
    if (submissionData.role === 'AUTHOR') {
      submissionData.authorName = `${submissionData.firstName} ${submissionData.lastName}`.trim();
    } else {
      submissionData.authorName = "";
    }

    // Log the data being sent to the backend for debugging
    // Removed console.log

    if (editingUser) {
      updateMutation.mutate({ username: editingUser.username, data: submissionData });
    } else {
      createMutation.mutate(submissionData);
    }
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: user.role,
      password: "",
      provider: user.provider || "local",
      providerId: user.providerId || null,
      authorName: user.authorName || "",
      avatar: user.avatar || "",
    });
    setIsDialogOpen(true);
  };

  const handleAnimatedDelete = (user: UserType) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleAnimatedDeleteNewsletter = (subscriber: any) => {
    setSubscriberToDelete(subscriber);
    setNewsletterDeleteDialogOpen(true);
  };

  const confirmNewsletterDelete = () => {
    if (subscriberToDelete) {
      deleteNewsletterMutation.mutate(subscriberToDelete.id);
    }
    setNewsletterDeleteDialogOpen(false);
    setSubscriberToDelete(null);
  };

  const cancelNewsletterDelete = () => {
    setNewsletterDeleteDialogOpen(false);
    setSubscriberToDelete(null);
  };

  const otherUsers = users.filter(
    (user: UserType) => user.id !== Number(currentUser?.id),
  );

  const filteredUsers = otherUsers.filter((user: UserType) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
      case "administrator":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "editor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "author":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("usersAndSubscribers")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("manageUsersAndSubscribers")}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              {t("newUser")}
            </Button>
          </DialogTrigger>
          <DialogContent >
            <DialogHeader>
              <DialogTitle>
                {editingUser ? t("editUser") : t("createNewUser")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2.5">
                <Label htmlFor="username">{t("username")}</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col space-y-2.5">
                <Label htmlFor="firstName">{t("firstName")}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col space-y-2.5">
                <Label htmlFor="lastName">{t("lastName")}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col space-y-2.5">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col space-y-2.5">
                <Label htmlFor="role">{t("role")}</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">{t("admin")}</SelectItem>
                    <SelectItem value="AUTHOR">{t("author")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2.5">
                <Label htmlFor="password">
                  {editingUser
                    ? t("newPasswordLabel")
                    : t("password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editingUser}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex space-x-2 gap-2">
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {editingUser ? t("update") : t("create")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("totalUsers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{otherUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("newsletterSubscribers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsletters.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t("activeAuthors")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                otherUsers.filter(
                  (u: UserType) => u.role && u.role.toUpperCase() === "AUTHOR"
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("admins")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {otherUsers.filter((u: UserType) => u.role === t("admin")).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Newsletter Subscribers Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("newsletterSubscribersWithCount", { count: newsletters.length })}</CardTitle>
        </CardHeader>
        <CardContent>
          {newsletters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-8 w-8 mx-auto mb-2" />
              <p>{t("noNewsletterSubscribersYet")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table dir={dir}>
                <TableHeader>
                  <TableRow>
                    <TableHead dir={dir}>{t("email")}</TableHead>
                    <TableHead dir={dir} className="hidden md:table-cell">
                      {t("subscribedDate")}
                    </TableHead>
                    <TableHead dir={dir} className="hidden lg:table-cell">
                      {t("status")}
                    </TableHead>
                    <TableHead dir={dir}>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsletters.map((subscriber: Newsletter) => (
                    <TableRow key={subscriber.id || subscriber.email}>
                      <TableCell>
                        <div className="flex items-center space-x-2 gap-2">
                          <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="font-medium">
                            {subscriber.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {subscriber.subscribedAt
                          ? new Date(subscriber.subscribedAt).toLocaleDateString()
                          : t("notAvailable")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={subscriber.isActive ? "default" : "secondary"}
                          >
                            {subscriber.isActive ? t("active") : t("inactive")}
                          </Badge>
                          <Switch
                            dir="ltr"
                            checked={subscriber.isActive}
                            onCheckedChange={() => handleToggleSubscriberState(subscriber)}
                            disabled={isTogglingSubscriber}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigator.clipboard.writeText(subscriber.email)
                            }
                            className="flex-shrink-0"
                          >
                            <Mail className="h-4 w-4" />
                            <span className="hidden sm:inline ml-1">{t("copy")}</span>
                          </Button>
                          <AnimatedDeleteButton
                            size="sm"
                            onAnimatedClick={() =>
                              handleAnimatedDeleteNewsletter(subscriber)
                            }
                            disabled={deleteNewsletterMutation.isPending}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="mb-3">{t("userManagement")}</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("searchUsersPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t("filterByRole")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allRoles")}</SelectItem>
                <SelectItem value="ADMIN">{t("admin")}</SelectItem>
                <SelectItem value="AUTHOR">{t("author")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t("loadingUsers")}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table dir={dir}>
                <TableHeader>
                  <TableRow>
                    <TableHead dir={dir}>{t("user")}</TableHead>
                    <TableHead dir={dir} className="hidden md:table-cell">
                      {t("email")}
                    </TableHead>
                    <TableHead dir={dir}>{t("role")}</TableHead>
                    <TableHead dir={dir} className="hidden lg:table-cell">
                      {t("articles")}
                    </TableHead>
                    <TableHead dir={dir} className="hidden lg:table-cell">
                      {t("joined")}
                    </TableHead>
                    <TableHead dir={dir} className="hidden xl:table-cell">
                      {t("lastLogin")}
                    </TableHead>
                    <TableHead dir={dir}>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: UserType) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2 ">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.username}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              @{user.username}
                            </p>
                            <p className="text-sm text-gray-500 truncate md:hidden">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role ? t(user.role.toLowerCase()) : ""}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {/* Show article count from API if available, fallback to user.articlesCount or 0 */}
                        {isArticleCountLoading
                          ? t("loading")
                          : (articleCountMap[user.authorName || ''] ?? user.articlesCount ?? 0)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                          <span
                            title={new Date(user.createdAt).toLocaleString()}
                            style={{ cursor: 'pointer', borderBottom: '1px dotted #888' }}
                          >
                            {formatDistanceToNow(new Date(user.createdAt), {
                              addSuffix: true,
                              locale: i18n.language === "ar" ? ar : enUS,
                            }).replace(/^about /, "")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : t("never")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(user)}
                            className="flex-shrink-0"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline ml-1">{t("edit")}</span>
                          </Button>
                          <AnimatedDeleteButton
                            size="sm"
                            onAnimatedClick={() => handleAnimatedDelete(user)}
                            disabled={deleteMutation.isPending || Number(currentUser?.id) === user.id}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title={t("deleteUserTitle")}
        description={t("deleteUserDescription", { username: userToDelete?.username })}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText={t("deleteUser")}
        cancelText={t("cancel")}
      />

      <DeleteConfirmationDialog
        open={newsletterDeleteDialogOpen}
        title={t("removeSubscriberTitle")}
        description={t("removeSubscriberDescription", { email: subscriberToDelete?.email })}
        onConfirm={confirmNewsletterDelete}
        onCancel={cancelNewsletterDelete}
        confirmText={t("remove")}
        cancelText={t("cancel")}
      />

      {subscriberToToggle && (
        <ToggleSubscriptionDialog
          open={toggleDialogOpen}
          title={t(
            subscriberToToggle.isActive
              ? "toggle_subscriber_active_confirmation_title_disable"
              : "toggle_subscriber_active_confirmation_title_enable",
          )}
          description={t(
            subscriberToToggle.isActive
              ? "toggle_subscriber_active_confirmation_description_disable"
              : "toggle_subscriber_active_confirmation_description_enable",
          )}
          onConfirm={confirmToggleSubscriberState}
          onCancel={cancelToggleSubscriberState}
          confirmText={t(subscriberToToggle.isActive ? "disable" : "enable")}
          cancelText={t("cancel")}
          isActive={!subscriberToToggle.isActive}
        />
      )}
    </div>
  );
}
