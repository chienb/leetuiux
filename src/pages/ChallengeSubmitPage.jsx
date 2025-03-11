import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createSubmission, getChallengeById } from '../lib/database';
import { supabase, getSignedUrl, getPublicUrl } from '../lib/supabase';

const ChallengeSubmitPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tools, setTools] = useState('');
  const [files, setFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [figmaEmbed, setFigmaEmbed] = useState('');
  const [figmaPreviewUrl, setFigmaPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState('');

  // Scroll to top when submission is successful
  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo(0, 0);
    }
  }, [isSubmitted]);

  // Fetch challenge data
  useEffect(() => {
    const fetchChallenge = async () => {
      if (id) {
        try {
          const result = await getChallengeById(id);
          if (result.success) {
            setChallenge(result.data);
          } else {
            // Fallback to mock data if fetch fails
            setChallenge({
              id: id || 1,
              title: 'E-commerce Product Page Redesign',
              difficulty: 'easy',
            });
          }
        } catch (error) {
          console.error('Error fetching challenge:', error);
          // Fallback to mock data
          setChallenge({
            id: id || 1,
            title: 'E-commerce Product Page Redesign',
            difficulty: 'easy',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChallenge();
  }, [id]);

  // Extract Figma URL from embed code
  const extractFigmaUrl = (embedCode) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(embedCode, 'text/html');
      const iframe = doc.querySelector('iframe');
      return iframe?.src || '';
    } catch (error) {
      console.error('Error parsing Figma embed code:', error);
      return '';
    }
  };

  // Update Figma preview when embed code changes
  useEffect(() => {
    if (figmaEmbed) {
      const url = extractFigmaUrl(figmaEmbed);
      setFigmaPreviewUrl(url);
    }
  }, [figmaEmbed]);

  // Handle preview image upload
  const handlePreviewImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file for the preview');
      return;
    }

    // Create a sanitized file name (replace spaces with underscores)
    const sanitizedFileName = file.name.replace(/\s+/g, '_');

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage({
      file,
      preview: previewUrl,
      name: sanitizedFileName,
      originalName: file.name,
      type: file.type,
      size: file.size
    });
  };

  // Handle project files upload
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Create preview URLs for the files
    const newFiles = selectedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      preview: URL.createObjectURL(file),
      file: file,
    }));
    
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(updatedFiles[index].preview);
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Refresh Figma preview
  const refreshFigmaPreview = () => {
    if (figmaPreviewUrl) {
      setFigmaPreviewUrl('');
      setTimeout(() => {
        setFigmaPreviewUrl(extractFigmaUrl(figmaEmbed));
      }, 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description || (!previewImage && files.length === 0)) {
      setError('Please fill in all fields and upload at least one file or preview image');
      return;
    }
    
    // Check if user is authenticated
    if (!currentUser) {
      navigate('/login', { state: { from: `/challenges/${id}/submit` } });
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Upload preview image to Supabase Storage
      let previewImageUrl = null;
      if (previewImage) {
        try {
          // Use the sanitized file name
          const previewFileName = `${Date.now()}-${previewImage.name}`;
          
          // Check if bucket exists
          const { data: buckets, error: bucketsError } = await supabase.storage
            .listBuckets();
            
          if (bucketsError) {
            console.error('Error listing buckets:', bucketsError);
            setError('Failed to access storage. Please try again.');
            setIsSubmitting(false);
            return;
          }
          
          // Find the available bucket
          const availableBuckets = buckets.map(bucket => bucket.name);
          console.log('Available buckets:', availableBuckets);
          
          // Use the first available bucket or default to 'submissions'
          const bucketToUse = availableBuckets.includes('submissions') 
            ? 'submissions' 
            : (availableBuckets.length > 0 ? availableBuckets[0] : 'submissions');
          
          console.log(`Using bucket: ${bucketToUse}`);
          
          // Create file options with content type
          const fileOptions = {
            contentType: previewImage.type,
            cacheControl: '3600',
            upsert: true
          };
          
          console.log('Uploading with options:', fileOptions);
          console.log('File type:', previewImage.type);
          
          const { data: previewData, error: previewError } = await supabase.storage
            .from(bucketToUse)
            .upload(`preview-images/${currentUser.id}/${previewFileName}`, previewImage.file, fileOptions);
          
          if (previewError) {
            console.error('Upload error details:', previewError);
            if (previewError.message.includes('bucket not found')) {
              setError(`Storage bucket "${bucketToUse}" not found. Available buckets: ${availableBuckets.join(', ')}`);
              setIsSubmitting(false);
              return;
            }
            throw previewError;
          }
          
          console.log('Upload successful:', previewData);
          
          // Make the file public
          const { error: updateError } = await supabase.storage
            .from(bucketToUse)
            .update(`preview-images/${currentUser.id}/${previewFileName}`, previewImage.file, {
              ...fileOptions,
              public: true
            });
            
          if (updateError) {
            console.error('Error making file public:', updateError);
          }
          
          // Get a signed URL for the preview image (valid for 1 week)
          const signedUrl = await getSignedUrl(
            bucketToUse, 
            `preview-images/${currentUser.id}/${previewFileName}`, 
            60 * 60 * 24 * 7
          );
          
          if (!signedUrl) {
            console.warn('Failed to create signed URL, falling back to public URL');
            // Fall back to public URL if signed URL fails
            const publicUrl = getPublicUrl(
              bucketToUse, 
              `preview-images/${currentUser.id}/${previewFileName}`
            );
            
            console.log('Using public URL:', publicUrl);
            previewImageUrl = publicUrl;
          } else {
            console.log('Using signed URL:', signedUrl);
            previewImageUrl = signedUrl;
          }
          
          // Test if the URL is accessible
          try {
            const testResponse = await fetch(previewImageUrl, { method: 'HEAD' });
            console.log('URL test response status:', testResponse.status);
            if (!testResponse.ok) {
              console.warn('URL may not be accessible:', previewImageUrl);
            }
          } catch (testError) {
            console.error('Error testing URL accessibility:', testError);
          }
          
          // Log the final URL for debugging
          console.log('Final preview image URL to be saved:', previewImageUrl);
        } catch (error) {
          console.error('Error uploading preview image:', error);
          setError('Failed to upload preview image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Upload project files to Supabase Storage
      const uploadedFiles = [];
      try {
        for (const file of files) {
          const fileName = `${Date.now()}-${file.name}`;
          const { data: fileData, error: fileError } = await supabase.storage
            .from('submissions')
            .upload(`project-files/${currentUser.id}/${fileName}`, file.file);
          
          if (fileError) {
            if (fileError.message.includes('bucket not found')) {
              setError('Storage bucket not found. Please make sure to run the create_storage_buckets.sql script.');
              setIsSubmitting(false);
              return;
            }
            throw fileError;
          }
          
          // Get a signed URL for the file (valid for 1 week)
          const signedUrl = await getSignedUrl(
            'submissions', 
            `project-files/${currentUser.id}/${fileName}`, 
            60 * 60 * 24 * 7
          );
          
          let fileUrl;
          if (!signedUrl) {
            console.warn('Failed to create signed URL for file, falling back to public URL');
            // Fall back to public URL if signed URL fails
            fileUrl = getPublicUrl('submissions', `project-files/${currentUser.id}/${fileName}`);
            console.log('Using public URL for file:', fileUrl);
          } else {
            console.log('Using signed URL for file:', signedUrl);
            fileUrl = signedUrl;
          }
          
          uploadedFiles.push({
            name: file.name,
            type: file.type,
            size: file.size,
            url: fileUrl
          });
        }
      } catch (error) {
        console.error('Error uploading project files:', error);
        setError('Failed to upload project files. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      // Create the submission in the database
      const submissionToSave = {
        challenge_id: challenge.id,
        user_id: currentUser.id,
        title,
        description,
        tools: tools,
        figma_embed: figmaEmbed,
        preview_image: previewImageUrl,
        files: uploadedFiles.length > 0 ? uploadedFiles : null,
        status: 'submitted'
      };
      
      console.log('Saving submission with data:', submissionToSave);
      
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .insert(submissionToSave)
        .select()
        .single();
      
      console.log('Submission data saved:', submissionData);
      
      if (submissionError) {
        console.error('Error saving submission:', submissionError);
        throw submissionError;
      }
      
      // Set submission as successful
      setIsSubmitted(true);
      setSubmissionType('submission');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Save draft functionality
  const saveDraft = async () => {
    // Check if user is authenticated
    if (!currentUser) {
      navigate('/login', { state: { from: `/challenges/${id}/submit` } });
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create submission record in the database with draft status
      const submissionData = {
        challengeId: id,
        userId: currentUser.id,
        title: title || 'Untitled Draft',
        description: description || '',
        tools: tools || '',
        previewImage: previewImage ? previewImage.preview : null,
        figmaEmbed: figmaPreviewUrl ? figmaEmbed : null,
        files: files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
          preview: file.preview
        })),
        status: 'draft'
      };
      
      const result = await createSubmission(submissionData);
      
      if (result.success) {
        // Set submission as successful
        setIsSubmitted(true);
        setSubmissionType('draft');
        setIsSubmitting(false);
      } else {
        if (result.error && result.error.message && result.error.message.includes("Could not find the 'files' column")) {
          setError('The submissions table is missing the files column. Please run the create_submissions_table.sql or update_submissions_table.sql script in your Supabase SQL Editor.');
        } else {
          setError('Failed to save draft. Please try again.');
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      if (error.message && error.message.includes("Could not find the 'files' column")) {
        setError('The submissions table is missing the files column. Please run the create_submissions_table.sql or update_submissions_table.sql script in your Supabase SQL Editor.');
      } else {
        setError('An error occurred while saving your draft.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link to={`/challenges/${id}`} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          Back to Challenge
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit Your Solution</h1>
        <p className="text-gray-600">{challenge?.title} Challenge</p>
      </div>

      {/* Success message */}
      {isSubmitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-600 font-medium">
              {submissionType === 'draft' 
                ? 'Your draft has been successfully saved!' 
                : 'Your solution has been successfully submitted!'}
            </p>
          </div>
          <div className="mt-3 ml-7">
            <Link 
              to="/challenges" 
              className="text-sm font-medium text-green-600 hover:text-green-500 mr-4"
            >
              Return to challenges
            </Link>
            <Link 
              to={`/challenges/${id}`} 
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              View challenge
            </Link>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submission Form - Only show if not yet submitted */}
      {!isSubmitted && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Preview Image Upload */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview Image</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                      <path d="M12 12v9"></path>
                      <path d="m16 16-4-4-4 4"></path>
                    </svg>
                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                      <label htmlFor="preview-upload" className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input 
                          id="preview-upload" 
                          name="preview-upload" 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"
                          onChange={handlePreviewImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    
                    {previewImage && (
                      <div className="mt-4">
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img src={previewImage.preview} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6 6 18"></path>
                              <path d="m6 6 12 12"></path>
                            </svg>
                          </button>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">{previewImage.name} ({formatFileSize(previewImage.size)})</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Files */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Files</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                      <path d="M12 12v9"></path>
                      <path d="m16 16-4-4-4 4"></path>
                    </svg>
                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                      <label htmlFor="project-files" className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>Upload files</span>
                        <input 
                          id="project-files" 
                          name="project-files" 
                          type="file" 
                          className="sr-only" 
                          multiple
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">ZIP, Figma, Sketch, or XD files up to 50MB</p>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h3>
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span className="truncate">{file.name}</span>
                            <span className="ml-2 text-gray-500">({formatFileSize(file.size)})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6 6 18"></path>
                              <path d="m6 6 12 12"></path>
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Figma Embed */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Figma Preview</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="figma-embed" className="block text-sm font-medium text-gray-700 mb-1">Figma Embed Code</label>
                    <textarea
                      id="figma-embed"
                      name="figma-embed"
                      rows="3"
                      placeholder="Paste your Figma embed code here..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      value={figmaEmbed}
                      onChange={(e) => setFigmaEmbed(e.target.value)}
                    ></textarea>
                    <p className="mt-2 text-sm text-gray-500">To get the embed code: Share → Copy embed code in Figma</p>
                  </div>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-700">Preview</h3>
                        <button 
                          type="button"
                          onClick={refreshFigmaPreview}
                          className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                          Refresh Preview
                        </button>
                      </div>
                    </div>
                    <div className="aspect-[16/9] bg-white p-4">
                      {figmaPreviewUrl ? (
                        <iframe 
                          src={figmaPreviewUrl} 
                          className="w-full h-full border-0"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                              <line x1="8" y1="21" x2="16" y2="21"></line>
                              <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                            <p className="mt-2 text-sm text-gray-500">Figma preview will appear here</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Give your submission a title"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      placeholder="Describe your solution and the decisions behind your design..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="tools" className="block text-sm font-medium text-gray-700 mb-1">Tools Used</label>
                    <input
                      type="text"
                      id="tools"
                      name="tools"
                      placeholder="e.g., Figma, Sketch, Adobe XD"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      value={tools}
                      onChange={(e) => setTools(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Submission Preview */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Preview</h2>
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage.preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      Ready to Submit
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Files</label>
                    <div className="text-sm text-gray-600">
                      {files.length > 0 ? `${files.length} file(s) uploaded` : 'No files uploaded yet'}
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Solution'
                    )}
                  </button>
                  <button 
                    type="button"
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={saveDraft}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Draft'}
                  </button>
                </div>
              </div>

              {/* Submission Guidelines */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Guidelines</h2>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Submit original work only
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Include source files
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Follow design requirements
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Provide clear documentation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      )}
    </main>
  );
};

export default ChallengeSubmitPage; 