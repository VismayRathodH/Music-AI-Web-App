
import React, { useState } from 'react';
import { Upload as UploadIcon, FileAudio, X, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState([]); // Currently handling single file flow for simplicity, but defined as array
    const [songMetadata, setSongMetadata] = useState({
        title: '',
        artist: '',
        genre: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            setSelectedFile(file);
            setSongMetadata(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            setSelectedFile(file);
            setSongMetadata(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !user) return;
        setUploading(true);

        try {
            // 1. Upload File to Storage
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const { data: fileData, error: uploadError } = await supabase.storage
                .from('songs')
                .upload(fileName, selectedFile);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('songs')
                .getPublicUrl(fileName);

            // 2. Insert Metadata to DB
            const { error: dbError } = await supabase
                .from('songs')
                .insert({
                    title: songMetadata.title,
                    artist: songMetadata.artist || 'Unknown Artist', // Fallback
                    genre: songMetadata.genre,
                    url: publicUrl,
                    user_id: user.id
                });

            if (dbError) throw dbError;

            // Success
            alert('Upload Successful!');
            navigate('/library');

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold text-white">Upload Music</h2>
                <p className="text-gray-400">Share your creations with the world</p>
            </div>

            {!selectedFile ? (
                // Upload Zone
                <div
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${isDragging
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 scale-[1.02]'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <UploadIcon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Drag & Drop your tracks here</h3>
                    <p className="text-gray-400 mb-6">or click to browse files (MP3, WAV)</p>

                    <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileSelect}
                    />
                    <label
                        htmlFor="file-upload"
                        className="glass-button font-medium px-8 py-3 cursor-pointer"
                    >
                        Select Files
                    </label>
                </div>
            ) : (
                // Metadata Form
                <div className="glass-panel p-8 max-w-lg mx-auto space-y-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 rounded bg-gray-800 flex items-center justify-center">
                            <FileAudio size={24} className="text-[var(--accent-primary)]" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-white font-medium truncate">{selectedFile.name}</div>
                            <div className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Title</label>
                            <input
                                type="text"
                                value={songMetadata.title}
                                onChange={(e) => setSongMetadata({ ...songMetadata, title: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--accent-primary)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Artist</label>
                            <input
                                type="text"
                                value={songMetadata.artist}
                                onChange={(e) => setSongMetadata({ ...songMetadata, artist: e.target.value })}
                                placeholder="Artist Name"
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--accent-primary)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Genre</label>
                            <input
                                type="text"
                                value={songMetadata.genre}
                                onChange={(e) => setSongMetadata({ ...songMetadata, genre: e.target.value })}
                                placeholder="e.g. Synthwave"
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--accent-primary)]"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <Loader size={20} className="animate-spin" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <span>Publish Song</span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Upload;
