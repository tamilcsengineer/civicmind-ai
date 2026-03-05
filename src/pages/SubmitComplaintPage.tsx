import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CitizenHeader } from '@/components/layouts/CitizenHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Loader2, Upload, Shield, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { getCategories, createComplaint } from '@/db/api';
import type { Category, ComplaintFormData } from '@/types';
import { useEffect } from 'react';
import { supabase } from '@/db/supabase';

export default function SubmitComplaintPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<ComplaintFormData>({
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      location: '',
      photo_url: ''
    }
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  }

  async function onSubmit(data: ComplaintFormData) {
    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        photo_url: uploadedImageUrl || undefined
      };
      
      const result = await createComplaint(formData);
      toast.success('Complaint submitted successfully!');
      navigate(`/track?id=${result.tracking_id}`);
    } catch (error) {
      toast.error('Failed to submit complaint');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize to max 1080p
          const maxDimension = 1080;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                  type: 'image/webp',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            'image/webp',
            0.8
          );
        };
      };
      reader.onerror = reject;
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let fileToUpload = file;
      
      // Check if compression is needed
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        toast.info('Compressing image...');
        fileToUpload = await compressImage(file);
        
        if (fileToUpload.size > maxSize) {
          toast.error('Image is too large even after compression');
          setUploading(false);
          return;
        }
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const sanitizedName = fileToUpload.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `${timestamp}_${randomStr}_${sanitizedName}`;

      setUploadProgress(50);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('app-a253br3vlssh_complaint_images')
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      setUploadProgress(75);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('app-a253br3vlssh_complaint_images')
        .getPublicUrl(data.path);

      setUploadedImageUrl(urlData.publicUrl);
      setUploadProgress(100);
      
      const finalSize = (fileToUpload.size / 1024).toFixed(2);
      toast.success(`Image uploaded successfully (${finalSize} KB)`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CitizenHeader />
      
      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Submit a Complaint
            </h1>
            <p className="text-lg text-muted-foreground">
              Report public issues anonymously. Your privacy is protected.
            </p>
          </div>

          {/* Privacy Notice */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Your Privacy is Protected</h3>
                  <p className="text-sm text-muted-foreground">
                    This platform does not collect personal information. You will receive a tracking ID to monitor your complaint status anonymously.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Complaint Details</CardTitle>
              <CardDescription>
                Provide information about the public issue you want to report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Brief description of the issue" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category_id"
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.icon} {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: 'Description is required', minLength: { value: 20, message: 'Description must be at least 20 characters' } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed information about the issue..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    rules={{ required: 'Location is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Street address, area, or landmark" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Photo (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      {uploadedImageUrl ? (
                        <div className="space-y-3">
                          <div className="relative inline-block">
                            <img 
                              src={uploadedImageUrl} 
                              alt="Uploaded" 
                              className="max-h-48 mx-auto rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={() => setUploadedImageUrl(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-success">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm font-medium">Image uploaded</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                          <div>
                            <Label htmlFor="photo-upload" className="cursor-pointer">
                              <span className="text-primary hover:underline">Click to upload</span>
                              <span className="text-muted-foreground"> or drag and drop</span>
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG, WEBP up to 1MB (auto-compressed if larger)
                            </p>
                          </div>
                          <Input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={uploading}
                          />
                          {uploading && (
                            <div className="space-y-2">
                              <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                              <p className="text-sm text-muted-foreground">
                                Uploading... {uploadProgress}%
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting || uploading}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Complaint'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
