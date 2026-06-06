import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../components/ui/Toast';

export interface VaultDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

export function useVault() {
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    if (!user || !supabase) return;
    try {
      setLoading(true);
      // Ensure the 'vault' bucket exists in Supabase.
      // This will list files under the user's folder.
      const { data, error } = await supabase
        .storage
        .from('vault')
        .list(user.id);

      if (error) throw error;

      const docs = data?.filter(file => file.name !== '.emptyFolderPlaceholder').map(file => {
        // Derive type from file name/metadata or just default
        let type = 'Other';
        if (file.name.toLowerCase().includes('passport') || file.name.toLowerCase().includes('id')) type = 'Identity';
        else if (file.name.toLowerCase().includes('tax') || file.name.toLowerCase().includes('bank')) type = 'Financial';
        else if (file.name.toLowerCase().includes('contract')) type = 'Contracts';
        else if (file.name.toLowerCase().includes('health') || file.name.toLowerCase().includes('medical')) type = 'Medical';

        return {
          id: file.id || file.name,
          name: file.name,
          type,
          date: new Date(file.created_at || Date.now()).toISOString().split('T')[0],
          size: (file.metadata?.size ? (file.metadata.size / 1024 / 1024).toFixed(1) + ' MB' : '0 MB')
        };
      }) || [];

      setDocuments(docs);
    } catch (err: any) {
      console.error('Failed to fetch vault documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const deleteDocument = async (fileName: string) => {
    if (!user || !supabase) return;
    try {
      const { error } = await supabase.storage.from('vault').remove([`${user.id}/${fileName}`]);
      if (error) throw error;
      setDocuments(prev => prev.filter(d => d.name !== fileName));
      addToast({ title: 'Deleted', message: 'Document deleted from vault', type: 'success' });
    } catch (err: any) {
      addToast({ title: 'Error', message: 'Failed to delete document', type: 'error' });
    }
  };

  const uploadDocument = async (file: File) => {
    if (!user || !supabase) return;
    try {
      addToast({ title: 'Uploading', message: 'Encrypting and uploading...', type: 'info' });
      const { error } = await supabase.storage.from('vault').upload(`${user.id}/${file.name}`, file, {
        cacheControl: '3600',
        upsert: true
      });
      if (error) throw error;
      addToast({ title: 'Uploaded', message: 'Document secured in vault', type: 'success' });
      fetchDocuments();
    } catch (err: any) {
      addToast({ title: 'Upload Failed', message: err.message, type: 'error' });
    }
  };

  return { documents, loading, deleteDocument, uploadDocument, refresh: fetchDocuments };
}
