import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  useAllServiceLinks,
  useCreateServiceLink,
  useUpdateServiceLink,
  useDeleteServiceLink,
} from "@/hooks/useServiceLinks";
import { ServiceLink } from "@/types/news";

const iconOptions = [
  { value: "Link", label: "Link" },
  { value: "Globe", label: "Globe" },
  { value: "Briefcase", label: "Briefcase" },
  { value: "Building", label: "Building" },
  { value: "GraduationCap", label: "Education" },
  { value: "Heart", label: "Heart" },
  { value: "Users", label: "Users" },
  { value: "Star", label: "Star" },
  { value: "Shield", label: "Shield" },
  { value: "Phone", label: "Phone" },
  { value: "FileText", label: "Document" },
  { value: "Wallet", label: "Wallet" },
  { value: "CreditCard", label: "Credit Card" },
  { value: "MapPin", label: "Location" },
];

export function ServiceLinkManager() {
  const { toast } = useToast();
  const { data: links, isLoading } = useAllServiceLinks();
  const createLink = useCreateServiceLink();
  const updateLink = useUpdateServiceLink();
  const deleteLink = useDeleteServiceLink();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ServiceLink | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [customIconUrl, setCustomIconUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setIcon("");
    setCustomIconUrl("");
    setDisplayOrder(0);
    setIsActive(true);
    setEditingLink(null);
  };

  const isCustomIconUrl = (iconValue: string | null) => {
    return iconValue && (iconValue.startsWith("http://") || iconValue.startsWith("https://"));
  };

  const openEditDialog = (link: ServiceLink) => {
    setEditingLink(link);
    setTitle(link.title);
    setDescription(link.description || "");
    setUrl(link.url);
    // Check if it's a custom URL or a Lucide icon name
    if (isCustomIconUrl(link.icon)) {
      setIcon("custom");
      setCustomIconUrl(link.icon || "");
    } else {
      setIcon(link.icon || "");
      setCustomIconUrl("");
    }
    setDisplayOrder(link.display_order);
    setIsActive(link.is_active);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Determine the final icon value
    const finalIcon = icon === "custom" ? customIconUrl : icon;

    const linkData = {
      title,
      description: description || null,
      url,
      icon: finalIcon || null,
      display_order: displayOrder,
      is_active: isActive,
    };

    try {
      if (editingLink) {
        await updateLink.mutateAsync({ id: editingLink.id, ...linkData });
        toast({ title: "Service link updated successfully" });
      } else {
        await createLink.mutateAsync(linkData);
        toast({ title: "Service link created successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteLink.mutateAsync(deleteConfirmId);
      toast({ title: "Service link deleted successfully" });
      setDeleteConfirmId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service link.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (link: ServiceLink) => {
    try {
      await updateLink.mutateAsync({
        id: link.id,
        is_active: !link.is_active,
      });
      toast({
        title: link.is_active ? "Link deactivated" : "Link activated",
      });
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Service Links</h1>
          <p className="text-muted-foreground mt-1">
            Manage external service links and resources for your users.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Service Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingLink ? "Edit Service Link" : "Add New Service Link"}
              </DialogTitle>
              <DialogDescription>
                {editingLink
                  ? "Update the service link details below."
                  : "Add a new external service or resource link."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Government Jobs Portal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this service"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <select
                  id="icon"
                  value={icon}
                  onChange={(e) => {
                    setIcon(e.target.value);
                    if (e.target.value !== "custom") {
                      setCustomIconUrl("");
                    }
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select icon</option>
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                  <option value="custom">Custom Image URL</option>
                </select>
              </div>

              {icon === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customIconUrl">Custom Icon URL</Label>
                  <Input
                    id="customIconUrl"
                    type="url"
                    value={customIconUrl}
                    onChange={(e) => setCustomIconUrl(e.target.value)}
                    placeholder="https://example.com/icon.png"
                  />
                  {customIconUrl && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">Preview:</span>
                      <img 
                        src={customIconUrl} 
                        alt="Icon preview" 
                        className="w-8 h-8 object-contain rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createLink.isPending || updateLink.isPending}
                >
                  {createLink.isPending || updateLink.isPending
                    ? "Saving..."
                    : editingLink
                    ? "Update"
                    : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Links Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading service links...
                  </TableCell>
                </TableRow>
              ) : links?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No service links yet. Add your first link to get started.
                  </TableCell>
                </TableRow>
              ) : (
                links?.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                        <span>{link.display_order}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{link.title}</p>
                        {link.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {link.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <span className="truncate max-w-[200px]">{link.url}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell>
                      {link.is_active ? (
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(link)}
                          title={link.is_active ? "Deactivate" : "Activate"}
                        >
                          <Switch checked={link.is_active} className="pointer-events-none" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(link)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmId(link.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service Link?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
