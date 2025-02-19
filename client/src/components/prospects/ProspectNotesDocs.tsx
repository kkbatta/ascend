import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Upload, Paperclip, Download } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from "@/hooks/use-toast";

type Note = {
  id: number;
  content: string;
  createdAt: string;
  createdBy: number;
};

type Document = {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: number;
};

type ProspectNotesDocsProps = {
  prospectId: number;
};

export const ProspectNotesDocs: React.FC<ProspectNotesDocsProps> = ({ prospectId }) => {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notes and documents
  const { data: notes = [] } = useQuery({
    queryKey: ['/api/prospects', prospectId, 'notes'],
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['/api/prospects', prospectId, 'documents'],
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest('/api/prospects/' + prospectId + '/notes', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prospects', prospectId, 'notes'] });
      setIsAddNoteOpen(false);
      setNoteContent('');
      toast({
        title: "Note added",
        description: "Your note has been successfully added.",
      });
    },
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return await apiRequest('/api/prospects/' + prospectId + '/documents', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prospects', prospectId, 'documents'] });
      setIsUploadOpen(false);
      setSelectedFile(null);
      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded.",
      });
    },
  });

  const handleAddNote = () => {
    if (noteContent.trim()) {
      addNoteMutation.mutate(noteContent);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadDocumentMutation.mutate(selectedFile);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Notes & Documents</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddNoteOpen(true)}
            className="h-7 text-xs"
          >
            <FileText className="w-3 h-3 mr-1" />
            Add Note
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            className="h-7 text-xs"
          >
            <Upload className="w-3 h-3 mr-1" />
            Upload
          </Button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-2">
        {notes.map((note: Note) => (
          <div key={note.id} className="text-sm bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600 whitespace-pre-line">{note.content}</p>
            <p className="text-xs text-gray-400 mt-1">
              Added {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-2">
        {documents.map((doc: Document) => (
          <div
            key={doc.id}
            className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{doc.fileName}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(doc.fileSize)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`/api/prospects/${prospectId}/documents/${doc.id}`)}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Note Dialog */}
      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Enter your note here..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              onClick={handleAddNote}
              disabled={!noteContent.trim() || addNoteMutation.isPending}
            >
              {addNoteMutation.isPending ? "Adding..." : "Add Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-gray-500">
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadDocumentMutation.isPending}
            >
              {uploadDocumentMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
