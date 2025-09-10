import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Check, 
  X, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  Trash2,
  Edit2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';
import { 
  DynamicBulkUploadProps, 
  BulkUploadFile, 
  ColumnMapping, 
  ValidationResult,
  UploadSummary,
  UploadError
} from '@/types/bulkUpload';

type UploadStep = 'information' | 'upload' | 'mapping' | 'review' | 'completion';

export default function DynamicBulkUpload({
  acceptedFileTypes = ['.csv', '.xlsx', '.xls'],
  maxFileSizeMB = 2,
  templateUrl,
  columnsConfig,
  onUpload,
  onValidate,
  onImportComplete,
  allowMultipleFiles = false,
  enableMapping = true,
  className,
  isOpen,
  onClose
}: DynamicBulkUploadProps) {
  const [currentStep, setCurrentStep] = useState<UploadStep>('information');
  const [files, setFiles] = useState<BulkUploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [uploadSummary, setUploadSummary] = useState<UploadSummary | null>(null);
  const [editingData, setEditingData] = useState<any[]>([]);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (selectedFiles: FileList) => {
    const newFiles: BulkUploadFile[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Validate file type
      const isValidType = acceptedFileTypes.some(type => 
        file.name.toLowerCase().endsWith(type.replace('.', ''))
      );
      
      if (!isValidType) {
        alert(`Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`);
        continue;
      }
      
      // Validate file size
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        alert(`File size exceeds ${maxFileSizeMB}MB limit`);
        continue;
      }
      
      if (!allowMultipleFiles && files.length > 0) {
        setFiles([]); // Replace existing file
      }
      
      const uploadFile: BulkUploadFile = {
        id: `${Date.now()}-${i}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        status: 'pending',
        progress: 0
      };
      
      newFiles.push(uploadFile);
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Process files
    for (const uploadFile of newFiles) {
      await processFile(uploadFile);
    }
  }, [acceptedFileTypes, maxFileSizeMB, allowMultipleFiles, files.length]);

  const processFile = async (uploadFile: BulkUploadFile) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 30 } : f
      ));

      // Read file content
      const data = await readFileData(uploadFile.file);
      
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, progress: 60 } : f
      ));

      // Upload file
      const processedData = await onUpload(uploadFile.file);
      
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: 'completed', 
          progress: 100,
          data: processedData || data
        } : f
      ));
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'error', progress: 0 } : f
      ));
    }
  };

  const readFileData = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          
          if (file.name.endsWith('.csv')) {
            // Parse CSV
            const text = data as string;
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim());
            const rows = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim());
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index] || '';
              });
              return row;
            });
            resolve(rows);
          } else {
            // Parse Excel
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            resolve(jsonData);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const autoMapColumns = (fileHeaders: string[]) => {
    const mappings: ColumnMapping[] = [];
    
    fileHeaders.forEach(header => {
      const bestMatch = columnsConfig.find(config => 
        config.displayName.toLowerCase() === header.toLowerCase() ||
        config.fieldName.toLowerCase() === header.toLowerCase()
      );
      
      if (bestMatch) {
        mappings.push({
          sourceColumn: header,
          targetColumn: bestMatch.fieldName,
          confidence: 1.0
        });
      } else {
        // Find partial matches
        const partialMatch = columnsConfig.find(config =>
          config.displayName.toLowerCase().includes(header.toLowerCase()) ||
          header.toLowerCase().includes(config.displayName.toLowerCase())
        );
        
        if (partialMatch) {
          mappings.push({
            sourceColumn: header,
            targetColumn: partialMatch.fieldName,
            confidence: 0.7
          });
        }
      }
    });
    
    setColumnMappings(mappings);
  };

  const validateData = () => {
    const allData = files.flatMap(f => f.data || []);
    const result = onValidate(allData, columnsConfig);
    setValidationResult(result);
    setEditingData([...result.invalidRows]);
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'information':
        setCurrentStep('upload');
        break;
      case 'upload':
        if (files.length > 0 && files.every(f => f.status === 'completed')) {
          if (enableMapping) {
            const firstFile = files[0];
            if (firstFile.data && firstFile.data.length > 0) {
              const headers = Object.keys(firstFile.data[0]);
              autoMapColumns(headers);
            }
            setCurrentStep('mapping');
          } else {
            validateData();
            setCurrentStep('review');
          }
        }
        break;
      case 'mapping':
        validateData();
        setCurrentStep('review');
        break;
      case 'review':
        const summary: UploadSummary = {
          totalRows: validationResult?.validRows.length || 0 + validationResult?.invalidRows.length || 0,
          successCount: validationResult?.validRows.length || 0,
          errorCount: validationResult?.invalidRows.length || 0,
          duplicateCount: 0,
          errors: validationResult?.errors || []
        };
        setUploadSummary(summary);
        onImportComplete(summary);
        setCurrentStep('completion');
        break;
    }
  };

  const handlePrevious = () => {
    switch (currentStep) {
      case 'upload':
        setCurrentStep('information');
        break;
      case 'mapping':
        setCurrentStep('upload');
        break;
      case 'review':
        setCurrentStep(enableMapping ? 'mapping' : 'upload');
        break;
      case 'completion':
        setCurrentStep('review');
        break;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'information':
        return true;
      case 'upload':
        return files.length > 0 && files.every(f => f.status === 'completed');
      case 'mapping':
        return columnMappings.length > 0;
      case 'review':
        return validationResult !== null;
      case 'completion':
        return false;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'information': return 'Bulk Upload Information';
      case 'upload': return 'File Upload';
      case 'mapping': return 'Column Mapping';
      case 'review': return 'Data Review';
      case 'completion': return 'Upload Complete';
    }
  };

  const renderInformationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FileSpreadsheet className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Bulk Upload Process</h3>
        <p className="text-muted-foreground">
          Upload your files and map columns to import data efficiently
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-600" />
            <span>Supported formats: {acceptedFileTypes.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-600" />
            <span>Maximum file size: {maxFileSizeMB}MB</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-600" />
            <span>Required columns: {columnsConfig.filter(c => c.validationRules?.required).map(c => c.displayName).join(', ')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUploadStep = () => (
    <div className="space-y-6">
      {templateUrl && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => window.open(templateUrl, '_blank')}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      )}
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          "hover:border-primary/50 cursor-pointer"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">
          <span className="text-primary">Click to Upload</span> or drag and drop
        </p>
        <p className="text-sm text-muted-foreground">
          {acceptedFileTypes.join(' or ')} (Maximum File Size {maxFileSizeMB} MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(',')}
          multiple={allowMultipleFiles}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Attached Files
              <Badge variant="secondary">{files.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                    </p>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="mt-2" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'completed' && (
                      <Badge variant="default" className="bg-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                    {file.status === 'error' && (
                      <Badge variant="destructive">
                        <X className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderMappingStep = () => {
    const firstFile = files[0];
    const fileHeaders = firstFile?.data && firstFile.data.length > 0 ? Object.keys(firstFile.data[0]) : [];
    
    return (
      <div className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Map your file columns to the required fields. Auto-mapping has been applied where possible.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Column Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fileHeaders.map((header) => {
                const mapping = columnMappings.find(m => m.sourceColumn === header);
                return (
                  <div key={header} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{header}</p>
                      <p className="text-sm text-muted-foreground">Source Column</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Select
                        value={mapping?.targetColumn || ''}
                        onValueChange={(value) => {
                          setColumnMappings(prev => {
                            const existing = prev.find(m => m.sourceColumn === header);
                            if (existing) {
                              return prev.map(m => 
                                m.sourceColumn === header 
                                  ? { ...m, targetColumn: value, confidence: 1.0 }
                                  : m
                              );
                            } else {
                              return [...prev, { sourceColumn: header, targetColumn: value, confidence: 1.0 }];
                            }
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select target column" />
                        </SelectTrigger>
                        <SelectContent>
                          {columnsConfig.map((config) => (
                            <SelectItem key={config.fieldName} value={config.fieldName}>
                              {config.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {mapping && mapping.confidence < 1.0 && (
                        <p className="text-xs text-amber-600 mt-1">Auto-mapped (confidence: {Math.round(mapping.confidence * 100)}%)</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      {validationResult && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{validationResult.validRows.length}</p>
                <p className="text-sm text-muted-foreground">Valid Records</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{validationResult.invalidRows.length}</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{validationResult.validRows.length + validationResult.invalidRows.length}</p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {validationResult && validationResult.errors.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Data Issues</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowErrorsOnly(!showErrorsOnly)}
              >
                {showErrorsOnly ? 'Show All' : 'Show Errors Only'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                    <TableHead>Column</TableHead>
                    <TableHead>Error</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validationResult.errors.map((error, index) => (
                    <TableRow key={index}>
                      <TableCell>{error.row}</TableCell>
                      <TableCell>{error.column}</TableCell>
                      <TableCell className="text-red-600">{error.error}</TableCell>
                      <TableCell>{String(error.value)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderCompletionStep = () => (
    <div className="space-y-6 text-center">
      <div>
        <Check className="mx-auto h-16 w-16 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload Complete!</h3>
        <p className="text-muted-foreground">Your data has been successfully processed</p>
      </div>

      {uploadSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-green-600">{uploadSummary.successCount}</p>
                <p className="text-sm text-muted-foreground">Successfully Imported</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-red-600">{uploadSummary.errorCount}</p>
                <p className="text-sm text-muted-foreground">Failed Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={() => {
          setCurrentStep('information');
          setFiles([]);
          setValidationResult(null);
          setUploadSummary(null);
        }}>
          Upload More Files
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-4xl max-h-[90vh]", className)}>
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {currentStep === 'information' && renderInformationStep()}
          {currentStep === 'upload' && renderUploadStep()}
          {currentStep === 'mapping' && renderMappingStep()}
          {currentStep === 'review' && renderReviewStep()}
          {currentStep === 'completion' && renderCompletionStep()}
        </div>

        {currentStep !== 'completion' && (
          <>
            <Separator />
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 'information'}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}