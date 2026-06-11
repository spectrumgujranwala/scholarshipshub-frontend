import React, { useState, useEffect, useRef } from 'react';
import axios from '../utils/axios';
import { Send, Paperclip, Download, User, MessageSquare, Clock, FileText, X } from 'lucide-react';

const RemarksSection = ({ applicationId, universityApplicationId, currentUser, title = "Remarks & Comments" }) => {
  const [remarks, setRemarks] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [attachment, setAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const remarksEndRef = useRef(null);

  const id = universityApplicationId || applicationId;
  const type = universityApplicationId ? 'university' : 'master';

  useEffect(() => {
    if (!id) return;

    fetchRemarks();
    // Poll for new remarks every 5 seconds
    const interval = setInterval(fetchRemarks, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchRemarks = async () => {
    try {
      const { data } = await axios.get(`/api/remarks/${id}?type=${type}`);
      setRemarks(data);
    } catch (err) {
      console.error('Error fetching remarks');
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('File size exceeds 15MB limit');
        e.target.value = '';
        return;
      }
      setAttachment(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !attachment) return;

    setLoading(true);
    let attachmentUrl = '';
    let attachmentName = '';

    try {
      if (attachment) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', attachment);
        formData.append('folder', 'remarks');

        const { data: uploadData } = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        attachmentUrl = uploadData.url;
        attachmentName = uploadData.fileName;
        setUploading(false);
      }

      const { data: newRemark } = await axios.post('/api/remarks', {
        applicationId: universityApplicationId ? undefined : applicationId,
        universityApplicationId: universityApplicationId || undefined,
        content,
        attachmentUrl,
        attachmentName
      });

      setRemarks([...remarks, { ...newRemark, sender: currentUser }]);
      setContent('');
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding remark');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (fetching) return <div>Loading remarks...</div>;

  return (
    <div className="remarks-section mt-20">
      <div className="card shadow-sm" style={{ borderTop: '4px solid #3b82f6' }}>
        <div className="flex items-center gap-10 mb-20 pb-10" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <MessageSquare size={20} color="#3b82f6" />
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>

        <div className="remarks-list mb-20" style={{
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {remarks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', fontStyle: 'italic', padding: '20px' }}>No remarks yet. Start the conversation!</p>
          ) : (
            remarks.map((remark, idx) => (
              <div key={idx} className="remark-item" style={{
                alignSelf: remark.sender?._id === currentUser?._id ? 'flex-end' : 'flex-start',
                display: 'flex', flexDirection: 'column', gap: '5px',
                width: '100%'
              }}>
                <div style={{
                  backgroundColor: remark.sender?._id === currentUser?._id ? '#eff6ff' : '#f9fafb',
                  padding: '12px 15px', borderRadius: '12px',
                  border: `1px solid ${remark.sender?._id === currentUser?._id ? '#bfdbfe' : '#e5e7eb'}`,
                  maxWidth: '90%', width: 'fit-content'
                }}>
                  <div className="flex justify-between items-center mb-5 gap-20">
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e40af' }}>
                      {remark.sender?._id === currentUser?._id ? (
                        <>
                          You <span style={{ fontWeight: 400, color: '#666', marginLeft: '5px', fontSize: '0.75rem' }}>({remark.senderDesignation})</span>
                        </>
                      ) : (
                        remark.sender?.role === 'admin' ? (
                          remark.senderDesignation
                        ) : (
                          <>
                            {remark.sender?.email || 'User'}
                            <span style={{ fontWeight: 400, color: '#666', marginLeft: '5px', fontSize: '0.75rem' }}>({remark.senderDesignation})</span>
                          </>
                        )
                      )}
                    </span>
                    <span className="flex items-center gap-5" style={{ fontSize: '0.7rem', color: '#999' }}>
                      <Clock size={12} /> {new Date(remark.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151', whiteSpace: 'pre-wrap' }}>{remark.content}</p>

                  {remark.attachmentUrl && (
                    <div className="mt-10 pt-10" style={{ borderTop: '1px solid #ddd' }}>
                      <a href={remark.attachmentUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-5" style={{ fontSize: '0.8rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                        <Download size={14} /> {remark.attachmentName || 'Download Attachment'}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={remarksEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="remark-form">
          <div style={{ position: 'relative' }}>
            <textarea
              placeholder="Leave a note or update here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: '100%', padding: '12px 15px', borderRadius: '8px',
                border: '1px solid #e5e7eb', minHeight: '80px', marginBottom: '10px',
                fontSize: '0.9rem', resize: 'vertical'
              }}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-10">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-5 btn-light"
                  style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px' }}
                >
                  <Paperclip size={16} /> {attachment ? 'File Attached' : 'Attach Document'}
                </button>
                {attachment && (
                  <div className="flex items-center gap-5" style={{ fontSize: '0.8rem', color: '#666' }}>
                    <FileText size={14} /> {attachment.name.substring(0, 15)}...
                    <X size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => {
                      setAttachment(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }} />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || uploading || (!content.trim() && !attachment)}
                className="btn btn-primary flex items-center gap-10"
                style={{ padding: '8px 20px', borderRadius: '8px' }}
              >
                {loading ? 'Sending...' : (
                  <>
                    Send <Send size={16} />
                  </>
                )}
              </button>
            </div>
            {uploading && <div style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '5px' }}>Uploading attachment...</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemarksSection;
