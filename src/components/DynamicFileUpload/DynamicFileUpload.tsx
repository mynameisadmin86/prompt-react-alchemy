import React, { useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  Download, 
  Trash2, 
  Eye, 
  Edit, 
  Search,
  Filter,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileUploadProps, StagedFile, UploadedFile, FileFilterState, FileUploadConfig } from '@/types/fileUpload';

const defaultConfig: FileUploadConfig = {
  categories: ['BR Amendment', 'Invoice', 'Contract', 'Other'],
  maxFiles: 10,
  maxFileSizeMB: 2,
  allowedTypes: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'xls', 'xlsx', 'doc', 'docx'],
  uploadEndpoint: '/api/upload',
  filesEndpoint: '/api/files'
};

const DynamicFileUpload: React.FC<FileUploadProps> = ({
  config = {},
  onUpload,
  onDelete,
  onDownload,
  className = ''
}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [filters, setFilters] = useState<FileFilterState>({
    searchTerm: '',
    selectedCategory: '',
    selectedFileType: ''
  });

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      category: '',
      remarks: ''
    }
  });

  const selectedCategory = watch('category');
  const remarks = watch('remarks');

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const validateFile = (file: File): string | null => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !finalConfig.allowedTypes?.includes(extension)) {
      return `File type .${extension} is not allowed`;
    }
    if (file.size > (finalConfig.maxFileSizeMB || 2) * 1024 * 1024) {
      return `File size exceeds ${finalConfig.maxFileSizeMB}MB limit`;
    }
    return null;
  };

  const handleFileSelection = useCallback((files: FileList) => {
    const newFiles: StagedFile[] = [];
    
    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "File Upload Error",
          description: error,
          variant: "destructive"
        });
        return;
      }

      if (stagedFiles.length + newFiles.length >= (finalConfig.maxFiles || 10)) {
        toast({
          title: "Maximum Files Reached",
          description: `You can only upload up to ${finalConfig.maxFiles} files`,
          variant: "destructive"
        });
        return;
      }

      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const stagedFile: StagedFile = {
        id: fileId,
        file,
        category: selectedCategory,
        remarks
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setStagedFiles(prev => 
            prev.map(f => 
              f.id === fileId 
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(stagedFile);
    });

    setStagedFiles(prev => [...prev, ...newFiles]);
  }, [stagedFiles, selectedCategory, remarks, finalConfig, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files);
    }
  }, [handleFileSelection]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelection(files);
    }
  }, [handleFileSelection]);

  const removeStagedFile = useCallback((fileId: string) => {
    setStagedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const handleUploadSubmit = useCallback(async () => {
    if (!selectedCategory) {
      toast({
        title: "Category Required",
        description: "Please select a file category before uploading",
        variant: "destructive"
      });
      return;
    }

    if (stagedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Update staged files with current form values
      const filesToUpload = stagedFiles.map(file => ({
        ...file,
        category: selectedCategory,
        remarks
      }));

      if (onUpload) {
        await onUpload(filesToUpload);
      }

      // Simulate successful upload by moving to uploaded files
      const newUploadedFiles: UploadedFile[] = filesToUpload.map(file => ({
        id: file.id,
        fileName: file.file.name,
        fileType: file.file.type,
        category: file.category || '',
        remarks: file.remarks,
        uploadDate: new Date().toISOString(),
        fileSize: file.file.size,
        downloadUrl: `#download-${file.id}`
      }));

      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      setStagedFiles([]);
      reset();

      toast({
        title: "Upload Successful",
        description: `${filesToUpload.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading files",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedCategory, remarks, stagedFiles, onUpload, reset, toast]);

  const handleDeleteFile = useCallback(async (fileId: string) => {
    try {
      if (onDelete) {
        await onDelete(fileId);
      }
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      toast({
        title: "File Deleted",
        description: "File deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  }, [onDelete, toast]);

  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = !filters.searchTerm || 
      file.fileName.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesCategory = !filters.selectedCategory || 
      filters.selectedCategory === 'all' || 
      file.category === filters.selectedCategory;
    const matchesFileType = !filters.selectedFileType || 
      file.fileName.toLowerCase().endsWith(filters.selectedFileType.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesFileType;
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">File Category *</Label>
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {finalConfig.categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              {...register('remarks')}
              placeholder="Enter remarks"
              className="resize-none"
            />
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports: {finalConfig.allowedTypes?.join(', ')} • Max {finalConfig.maxFileSizeMB}MB each
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={finalConfig.allowedTypes?.map(type => `.${type}`).join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Staged Files Preview */}
          {stagedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Files to Upload ({stagedFiles.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {stagedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getFileIcon(file.file.name)}
                      <span className="text-sm font-medium truncate">{file.file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStagedFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUploadSubmit}
            disabled={stagedFiles.length === 0 || !selectedCategory || isUploading}
            className="w-full"
          >
            <Check className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Save'}
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Total Attachments ({uploadedFiles.length})</CardTitle>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={filters.selectedCategory}
              onValueChange={(value) => setFilters(prev => ({ ...prev, selectedCategory: value }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {finalConfig.categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No files uploaded yet</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFiles.map(file => (
                <Card key={file.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getFileIcon(file.fileName)}
                      <span className="font-medium truncate">{file.fileName}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {file.category}
                    </Badge>
                    
                    <p className="text-xs text-muted-foreground">
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                    
                    {file.remarks && (
                      <p className="text-xs text-muted-foreground italic truncate">
                        {file.remarks}
                      </p>
                    )}
                    
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload?.(file)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* view functionality */}}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicFileUpload;