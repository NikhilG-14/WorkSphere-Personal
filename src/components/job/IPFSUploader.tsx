import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface Attachment {
  cid: string;
  name: string;
  size: number;
}

interface IPFSUploaderProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_TOTAL_SIZE = 200 * 1024 * 1024; // 200MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
];

export default function IPFSUploader({
  attachments,
  onChange,
}: IPFSUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [manualCID, setManualCID] = useState("");

  const totalSize = attachments.reduce((sum, file) => sum + file.size, 0);

  const simulateIPFSUpload = async (file: File): Promise<string> => {
    // Simulate IPFS upload with progress
    const fileId = `${file.name}-${Date.now()}`;
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setUploadProgress((prev) => ({ ...prev, [fileId]: i }));
    }

    // Generate mock CID
    const mockCID = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });

    return mockCID;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const errors: string[] = [];
    const validFiles: File[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (max 50MB)`);
        continue;
      }

      if (totalSize + file.size > MAX_TOTAL_SIZE) {
        errors.push(`${file.name}: Total size limit exceeded (max 200MB)`);
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      toast({
        title: "Upload Errors",
        description: errors.join(", "),
        variant: "destructive",
      });
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const newAttachments: Attachment[] = [];

      for (const file of validFiles) {
        const cid = await simulateIPFSUpload(file);
        newAttachments.push({
          cid,
          name: file.name,
          size: file.size,
        });
      }

      onChange([...attachments, ...newAttachments]);

      toast({
        title: "Upload Complete",
        description: `${newAttachments.length} file(s) uploaded to IPFS`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files to IPFS. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleManualCID = () => {
    if (!manualCID.trim()) return;

    // Basic CID validation (starts with Qm)
    if (!manualCID.startsWith("Qm")) {
      toast({
        title: "Invalid CID",
        description: "CID must start with 'Qm'",
        variant: "destructive",
      });
      return;
    }

    const newAttachment: Attachment = {
      cid: manualCID,
      name: `Manual Upload - ${manualCID.substring(0, 10)}...`,
      size: 0,
    };

    onChange([...attachments, newAttachment]);
    setManualCID("");

    toast({
      title: "CID Added",
      description: "Manual CID added successfully",
    });
  };

  const removeAttachment = (cid: string) => {
    onChange(attachments.filter((file) => file.cid !== cid));
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-glass-border space-y-4">
      <h2 className="text-2xl font-semibold text-neon-gold flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-neon-gold/20 flex items-center justify-center text-sm">
          <Upload className="h-4 w-4" />
        </div>
        Attachments (Optional)
      </h2>

      <Alert className="border-neon-cyan/30 bg-neon-cyan/5">
        <AlertCircle className="h-4 w-4 text-neon-cyan" />
        <AlertDescription className="text-foreground-muted text-sm">
          Upload project files, mockups, or requirements. Max 50MB per file,
          200MB total. Supports images, PDFs, and ZIP files.
        </AlertDescription>
      </Alert>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-glass-border rounded-lg p-8 text-center hover:border-neon-gold/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 rounded-full bg-neon-gold/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-neon-gold" />
          </div>
          <div>
            <p className="text-foreground font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-foreground-muted text-sm mt-1">
              Images, PDFs, ZIP files (Max 50MB each)
            </p>
          </div>
        </motion.div>
      </div>

      {/* Manual CID Input */}
      <div className="space-y-2">
        <Label className="text-foreground text-sm">Or paste IPFS CID manually</Label>
        <div className="flex gap-2">
          <Input
            value={manualCID}
            onChange={(e) => setManualCID(e.target.value)}
            placeholder="Qm..."
            className="bg-background-elevated border-input-border"
          />
          <Button
            onClick={handleManualCID}
            variant="outline"
            className="border-neon-gold/30 text-neon-gold hover:bg-neon-gold/10"
          >
            Add CID
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-neon-primary" />
              <div className="flex-1">
                <div className="h-2 bg-background-elevated rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-foreground-muted">{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      <AnimatePresence mode="popLayout">
        {attachments.map((file) => (
          <motion.div
            key={file.cid}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-background-elevated border border-glass-border"
          >
            <div className="w-10 h-10 rounded-lg bg-neon-gold/10 flex items-center justify-center">
              <File className="h-5 w-5 text-neon-gold" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {file.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-foreground-muted">
                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span className="truncate">CID: {file.cid.substring(0, 12)}...</span>
              </div>
            </div>

            <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeAttachment(file.cid)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/20 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Summary */}
      {attachments.length > 0 && (
        <div className="flex justify-between items-center text-sm pt-2 border-t border-glass-border">
          <span className="text-foreground-muted">
            {attachments.length} file(s) uploaded
          </span>
          <span className="text-foreground-muted">
            Total: {(totalSize / 1024 / 1024).toFixed(2)} / 200 MB
          </span>
        </div>
      )}
    </div>
  );
}
