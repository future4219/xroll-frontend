import { Share2, Clock, AlertTriangle, Lock } from "lucide-react";
import {
  UploadTask,
  VaultItem,
  Visibility,
} from "@/components/features/Gofile/GofileVault/types";
import { Badge } from "@/components/ui/Badge";

export function VisibilityBadge({ v }: { v?: Visibility }) {
  if (v === "shared")
    return (
      <Badge tone="emerald">
        <Share2 className="h-3 w-3" />
        共有中
      </Badge>
    );
  if (v === "processing")
    return (
      <Badge tone="amber">
        <Clock className="h-3 w-3" />
        処理中
      </Badge>
    );
  if (v === "failed")
    return (
      <Badge tone="red">
        <AlertTriangle className="h-3 w-3" />
        要対応
      </Badge>
    );
  return (
    <Badge>
      <Lock className="h-3 w-3" />
      非公開
    </Badge>
  );
}
