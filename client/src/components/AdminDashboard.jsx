import React, { useState, useEffect } from 'react';
import { LogOut, Calendar, Plus, Trash2, CheckCircle2, User, KeyRound, Save, BarChart2, Users, ClipboardList, TrendingUp, CheckSquare, Briefcase, FileText, Activity, Download, Edit2, Star, AlertTriangle } from 'lucide-react';

export default function AdminDashboard({ backendUrl }) {
  const [token, setToken] = useState(localStorage.getItem('jkc_admin_token') || '');
  const [username, setUsername] = useState(localStorage.getItem('jkc_admin_user') || '');
  
  // Login fields
  const [loginFields, setLoginFields] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  // Dashboard states - Default tab is now 'crm' (Analytical CRM Dashboard)
  const [activeTab, setActiveTab] = useState('crm');
  const [enquiries, setEnquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardMessage, setDashboardMessage] = useState({ type: '', text: '' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState([]);



  // Add Project fields
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Residential',
    image_url: '',
    year: new Date().getFullYear(),
    status: 'Completed'
  });

  // Edit enquiry states
  const [editingNotes, setEditingNotes] = useState({});
  const [imageSourceType, setImageSourceType] = useState('url');

  // Reviews state variables
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null); // null means adding a new review
  const [reviewFields, setReviewFields] = useState({
    author_name: '',
    author_photo_url: '',
    rating: 5,
    relative_time_description: 'a week ago',
    text: '',
    source: 'Google'
  });

  // Gallery state variables
  const [galleryItems, setGalleryItems] = useState([]);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    description: '',
    media_url: '',
    media_type: 'image'
  });
  const [galleryImageSourceType, setGalleryImageSourceType] = useState('url');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showMsg('error', 'File size is too large. Please select an image under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProject({ ...newProject, image_url: reader.result });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (token) {
      fetchEnquiries();
      fetchProjects();
      fetchReviews();
      fetchGalleryItems();
    }
  }, [token]);

  const handleLoginChange = (e) => {
    setLoginFields({ ...loginFields, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    fetch(`${backendUrl || 'http://localhost:5000'}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginFields)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid username or password');
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('jkc_admin_token', data.token);
        localStorage.setItem('jkc_admin_user', data.username);
        setToken(data.token);
        setUsername(data.username);
      })
      .catch((err) => {
        setLoginError(err.message || 'Login failed.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('jkc_admin_token');
    localStorage.removeItem('jkc_admin_user');
    setToken('');
    setUsername('');
    setEnquiries([]);
    setProjects([]);
  };

  const fetchEnquiries = () => {
    setLoading(true);
    fetch(`${backendUrl || 'http://localhost:5000'}/api/admin/enquiries`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          throw new Error('Session expired');
        }
        return res.json();
      })
      .then((data) => {
        setEnquiries(data);
        // Seed edit state
        const notesObj = {};
        data.forEach(e => { notesObj[e.id] = e.notes || ''; });
        setEditingNotes(notesObj);
      })
      .catch((err) => console.error('Enquiries fetch error:', err))
      .finally(() => setLoading(false));
  };

  const fetchProjects = () => {
    fetch(`${backendUrl || 'http://localhost:5000'}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Projects fetch error:', err));
  };

  const fetchReviews = () => {
    fetch(`${backendUrl || 'http://localhost:5000'}/api/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error('Reviews fetch error:', err));
  };

  const fetchGalleryItems = () => {
    fetch(`${backendUrl || 'http://localhost:5000'}/api/gallery`)
      .then((res) => res.json())
      .then((data) => setGalleryItems(data))
      .catch((err) => console.error('Gallery items fetch error:', err));
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!editingReviewId;
    const url = isEdit 
      ? `${backendUrl || 'http://localhost:5000'}/api/admin/reviews/${editingReviewId}`
      : `${backendUrl || 'http://localhost:5000'}/api/admin/reviews`;
    
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewFields)
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to ${isEdit ? 'update' : 'create'} review`);
        return res.json();
      })
      .then(() => {
        showMsg('success', `Review ${isEdit ? 'updated' : 'created'} successfully!`);
        setReviewFields({
          author_name: '',
          author_photo_url: '',
          rating: 5,
          relative_time_description: 'a week ago',
          text: '',
          source: 'Google'
        });
        setEditingReviewId(null);
        fetchReviews();
      })
      .catch((err) => showMsg('error', err.message))
      .finally(() => setLoading(false));
  };

  const handleDeleteReview = (id) => {
    requestConfirm(
      'Delete Review',
      'Are you sure you want to permanently delete this Google review?',
      () => {
        fetch(`${backendUrl || 'http://localhost:5000'}/api/admin/reviews/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then((res) => {
            if (!res.ok) throw new Error('Deletion failed');
            return res.json();
          })
          .then(() => {
            showMsg('success', 'Review deleted successfully!');
            fetchReviews();
            if (editingReviewId === id) {
              setEditingReviewId(null);
              setReviewFields({
                author_name: '',
                author_photo_url: '',
                rating: 5,
                relative_time_description: 'a week ago',
                text: '',
                source: 'Google'
              });
            }
          })
          .catch((err) => showMsg('error', err.message));
      }
    );
  };


  const handleEditReviewSelect = (review) => {
    setEditingReviewId(review.id);
    setReviewFields({
      author_name: review.author_name,
      author_photo_url: review.author_photo_url || '',
      rating: review.rating,
      relative_time_description: review.relative_time_description,
      text: review.text,
      source: review.source || 'Google'
    });
  };

  const updateEnquiryStatus = (id, status) => {
    const notes = editingNotes[id] || '';
    
    fetch(`${backendUrl || 'http://localhost:5000'}/api/admin/enquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, notes })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then(() => {
        showMsg('success', 'Enquiry updated successfully!');
        fetchEnquiries();
      })
      .catch((err) => showMsg('error', err.message));
  };

  const handleNotesChange = (id, value) => {
    setEditingNotes({ ...editingNotes, [id]: value });
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch(`${backendUrl || 'http://localhost:5000'}/api/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newProject)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create project');
        return res.json();
      })
      .then(() => {
        showMsg('success', 'Project created successfully!');
        setNewProject({
          title: '',
          description: '',
          category: 'Residential',
          image_url: '',
          year: new Date().getFullYear(),
          status: 'Completed'
        });
        setImageSourceType('url');
        fetchProjects();
      })
      .catch((err) => showMsg('error', err.message))
      .finally(() => setLoading(false));
  };

  const handleDeleteProject = (id) => {
    requestConfirm(
      'Delete Project',
      'Are you sure you want to permanently delete this project from your portfolio?',
      () => {
        fetch(`${backendUrl || 'http://localhost:5000'}/api/admin/projects/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then((res) => {
            if (!res.ok) throw new Error('Deletion failed');
            return res.json();
          })
          .then(() => {
            showMsg('success', 'Project deleted!');
            fetchProjects();
          })
          .catch((err) => showMsg('error', err.message));
      }
    );
  };


  const handleAddGalleryItem = (e) => {
    e.preventDefault();
    setLoading(true);

    let payload = [];

    if (galleryImageSourceType === 'url') {
      if (!newGalleryItem.media_url) {
        showMsg('error', 'Please provide a media URL.');
        setLoading(false);
        return;
      }
      payload = {
        title: newGalleryItem.title || 'Untitled Gallery Item',
        description: newGalleryItem.description || '',
        media_url: newGalleryItem.media_url,
        media_type: newGalleryItem.media_type
      };
    } else {
      if (selectedGalleryFiles.length === 0) {
        showMsg('error', 'Please select at least one file to upload.');
        setLoading(false);
        return;
      }
      payload = selectedGalleryFiles.map((item, index) => {
        const baseTitle = newGalleryItem.title || item.name.replace(/\.[^/.]+$/, "");
        const title = selectedGalleryFiles.length > 1 && newGalleryItem.title 
          ? `${baseTitle} - ${index + 1}` 
          : baseTitle;
        return {
          title,
          description: newGalleryItem.description || '',
          media_url: item.media_url,
          media_type: item.media_type
        };
      });
    }

    fetch(`${backendUrl || 'http://localhost:5000'}/api/admin/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create gallery item(s)');
        return res.json();
      })
      .then(() => {
        showMsg('success', 'Gallery item(s) created successfully!');
        setNewGalleryItem({
          title: '',
          description: '',
          media_url: '',
          media_type: 'image'
        });
        setSelectedGalleryFiles([]);
        setGalleryImageSourceType('url');
        fetchGalleryItems();
      })
      .catch((err) => showMsg('error', err.message))
      .finally(() => setLoading(false));
  };


  const handleDeleteGalleryItem = (id) => {
    requestConfirm(
      'Delete Gallery Media',
      'Are you sure you want to permanently delete this media item from the gallery?',
      () => {
        const url = `${backendUrl || 'http://localhost:5000'}/api/admin/gallery/${id}`;
        fetch(url, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then((res) => {
            if (!res.ok) throw new Error(`Deletion failed with status ${res.status}`);
            return res.json();
          })
          .then(() => {
            showMsg('success', 'Gallery item deleted!');
            fetchGalleryItems();
          })
          .catch((err) => showMsg('error', err.message));
      }
    );
  };



  const handleGalleryFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.size > 30 * 1024 * 1024) {
        showMsg('error', `File ${file.name} is too large. Please select files under 30MB.`);
        return;
      }
    }

    try {
      const readPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const fileType = file.type.startsWith('video/') ? 'video' : 'image';
            resolve({
              name: file.name,
              media_url: reader.result,
              media_type: fileType
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const loadedFiles = await Promise.all(readPromises);
      setSelectedGalleryFiles((prev) => [...prev, ...loadedFiles]);
    } catch (err) {
      console.error('Error reading files:', err);
      showMsg('error', 'Failed to read selected files.');
    }
  };


  const handleRemoveSelectedFile = (index) => {
    setSelectedGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };


  const handleDeleteEnquiry = (id) => {
    requestConfirm(
      'Delete Enquiry',
      'Are you sure you want to permanently delete this customer enquiry?',
      () => {
        fetch(`${backendUrl || 'http://localhost:5000'}/api/admin/enquiries/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then((res) => {
            if (!res.ok) throw new Error('Deletion failed');
            return res.json();
          })
          .then(() => {
            showMsg('success', 'Enquiry deleted successfully!');
            fetchEnquiries();
          })
          .catch((err) => showMsg('error', err.message));
      }
    );
  };


  const showMsg = (type, text) => {
    setDashboardMessage({ type, text });
    setTimeout(() => setDashboardMessage({ type: '', text: '' }), 4000);
  };

  const requestConfirm = (title, message, onConfirm) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };


  const exportToExcel = () => {
    if (enquiries.length === 0) {
      showMsg('error', 'No enquiries to export!');
      return;
    }

    // Define CSV headers
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Project Type', 'Message', 'Status', 'Notes', 'Date'];

    // Map enquiries to CSV rows
    const rows = enquiries.map(e => [
      e.id,
      e.name || '',
      e.email || '',
      e.phone || '',
      e.project_type || '',
      (e.message || '').replace(/\n/g, ' | '),  // flatten newlines
      e.status || '',
      (e.notes || '').replace(/\n/g, ' | '),
      new Date(e.created_at).toLocaleString()
    ]);

    // Build CSV string — wrap fields in quotes to handle commas
    const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
    const csvContent = [headers, ...rows]
      .map(row => row.map(escape).join(','))
      .join('\n');

    // Create blob and trigger download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const now = new Date();
    link.download = `JKC_Enquiries_${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showMsg('success', `${enquiries.length} enquiries exported successfully!`);
  };

  // CALCULATE CRM METRICS
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter(e => e.status === 'New').length;
  const contactedEnquiries = enquiries.filter(e => e.status === 'Contacted').length;
  const inProgressEnquiries = enquiries.filter(e => e.status === 'In Progress').length;
  const resolvedEnquiries = enquiries.filter(e => e.status === 'Resolved').length;
  const pendingEnquiries = totalEnquiries - resolvedEnquiries;
  const resolutionRate = totalEnquiries ? Math.round((resolvedEnquiries / totalEnquiries) * 100) : 0;

  // Enquiries by Service Category
  const catCivil = enquiries.filter(e => e.project_type === 'Civil Construction').length;
  const catRenovation = enquiries.filter(e => e.project_type === 'House Renovation').length;
  const catInterior = enquiries.filter(e => e.project_type === 'Interior Designing').length;
  const catArch = enquiries.filter(e => e.project_type === 'Architecture & Map Design').length;
  const catConsultancy = enquiries.filter(e => e.project_type === 'Property Consultancy').length;
  const maxCategoryCount = Math.max(1, catCivil, catRenovation, catInterior, catArch, catConsultancy);

  // Projects Breakdown
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const projResidential = projects.filter(p => p.category === 'Residential').length;
  const projCommercial = projects.filter(p => p.category === 'Commercial').length;
  const projInterior = projects.filter(p => p.category === 'Interior').length;
  const maxProjectCatCount = Math.max(1, projResidential, projCommercial, projInterior);

  // IF NOT AUTHENTICATED - SHOW LOGIN SCREEN
  if (!token) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 180px)',
        padding: '24px'
      }}>
        <div className="glass-panel" style={{
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 40px var(--shadow-color)'
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '6px',
            fontSize: '26px',
            color: 'var(--text-primary)',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Admin <span className="title-accent">Portal</span>
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '28px'
          }}>
            JK Construction Management Dashboard
          </p>

          {loginError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="username"
                  value={loginFields.username}
                  onChange={handleLoginChange}
                  placeholder="admin"
                  required
                  style={{ paddingLeft: '38px' }}
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  name="password"
                  value={loginFields.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  required
                  style={{ paddingLeft: '38px' }}
                />
                <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '10px' }}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED - SHOW MAIN DASHBOARD
  return (
    <div className="container" style={{ padding: '40px 24px', minHeight: 'calc(100vh - 180px)' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
            Welcome back, <span className="title-accent">{username}</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Manage JK Construction enquiries and edit projects live.
          </p>
        </div>

        {/* Buttons: CRM and Logout */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('crm')}
            className={activeTab === 'crm' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '14px', gap: '6px', display: 'flex', alignItems: 'center' }}
          >
            <BarChart2 size={16} />
            CRM Dashboard
          </button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px', gap: '6px', display: 'flex', alignItems: 'center' }}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Message Notifications */}
      {dashboardMessage.text && (
        <div style={{
          background: dashboardMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${dashboardMessage.type === 'success' ? 'var(--status-resolved)' : '#ef4444'}`,
          color: dashboardMessage.type === 'success' ? 'var(--status-resolved)' : '#ef4444',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '20px',
          fontWeight: 500
        }}>
          {dashboardMessage.text}
        </div>
      )}

      {/* Sub Menu Tabs */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--card-border)', marginBottom: '30px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0' }}>
          <button
            onClick={() => setActiveTab('crm')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'crm' ? 'var(--accent-color)' : 'var(--text-primary)',
              fontWeight: activeTab === 'crm' ? 700 : 500,
              fontSize: '16px',
              padding: '12px 8px',
              cursor: 'pointer',
              borderBottom: activeTab === 'crm' ? '3px solid var(--accent-color)' : 'none',
              marginRight: '16px'
            }}
          >
            CRM Overview
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'enquiries' ? 'var(--accent-color)' : 'var(--text-primary)',
              fontWeight: activeTab === 'enquiries' ? 700 : 500,
              fontSize: '16px',
              padding: '12px 8px',
              cursor: 'pointer',
              borderBottom: activeTab === 'enquiries' ? '3px solid var(--accent-color)' : 'none',
              marginRight: '16px'
            }}
          >
            Customer Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'projects' ? 'var(--accent-color)' : 'var(--text-primary)',
              fontWeight: activeTab === 'projects' ? 700 : 500,
              fontSize: '16px',
              padding: '12px 8px',
              cursor: 'pointer',
              borderBottom: activeTab === 'projects' ? '3px solid var(--accent-color)' : 'none',
              marginRight: '16px'
            }}
          >
            Manage Projects Portfolio
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'reviews' ? 'var(--accent-color)' : 'var(--text-primary)',
              fontWeight: activeTab === 'reviews' ? 700 : 500,
              fontSize: '16px',
              padding: '12px 8px',
              cursor: 'pointer',
              borderBottom: activeTab === 'reviews' ? '3px solid var(--accent-color)' : 'none'
            }}
          >
            Manage Google Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'gallery' ? 'var(--accent-color)' : 'var(--text-primary)',
              fontWeight: activeTab === 'gallery' ? 700 : 500,
              fontSize: '16px',
              padding: '12px 8px',
              cursor: 'pointer',
              borderBottom: activeTab === 'gallery' ? '3px solid var(--accent-color)' : 'none'
            }}
          >
            Manage Gallery ({galleryItems.length})
          </button>
        </div>

        {/* Export Button - always visible */}
        <button
          onClick={exportToExcel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
            transition: 'all 0.2s ease',
            fontFamily: 'Outfit, sans-serif',
            marginBottom: '4px'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          title="Export all enquiries to Excel"
        >
          <Download size={15} />
          Export to Excel
        </button>
      </div>

      {/* 1. CRM OVERVIEW ANALYTICS TAB */}
      {activeTab === 'crm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Top Row: Metric Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {/* Total leads card */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--status-new)' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--status-new)', padding: '12px', borderRadius: '12px' }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Leads</div>
                <h3 style={{ fontSize: '26px', color: 'var(--text-primary)', marginTop: '2px' }}>{totalEnquiries}</h3>
              </div>
            </div>

            {/* New leads card */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--status-contacted)' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-contacted)', padding: '12px', borderRadius: '12px' }}>
                <ClipboardList size={22} />
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>New Queries</div>
                <h3 style={{ fontSize: '26px', color: 'var(--text-primary)', marginTop: '2px' }}>{newEnquiries}</h3>
              </div>
            </div>

            {/* Pending leads card */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--status-inprogress)' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--status-inprogress)', padding: '12px', borderRadius: '12px' }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Pending Enquiries</div>
                <h3 style={{ fontSize: '26px', color: 'var(--text-primary)', marginTop: '2px' }}>{pendingEnquiries}</h3>
              </div>
            </div>

            {/* Resolved leads card */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--status-resolved)' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-resolved)', padding: '12px', borderRadius: '12px' }}>
                <CheckSquare size={22} />
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Resolved Leads</div>
                <h3 style={{ fontSize: '26px', color: 'var(--text-primary)', marginTop: '2px' }}>{resolvedEnquiries}</h3>
              </div>
            </div>
          </div>

          {/* Middle Row: Service Analysis & Portfolio Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '30px'
          }} className="crm-middle-grid">
            
            {/* Enquiry Services Breakdown */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={18} style={{ color: 'var(--accent-color)' }} />
                Service Interest Breakdown
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {[
                  { name: 'Civil Construction', count: catCivil },
                  { name: 'House Renovation', count: catRenovation },
                  { name: 'Interior Designing', count: catInterior },
                  { name: 'Architecture & Map Design', count: catArch },
                  { name: 'Property Consultancy', count: catConsultancy }
                ].map((item) => {
                  const percent = maxCategoryCount ? (item.count / maxCategoryCount) * 100 : 0;
                  return (
                    <div key={item.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                        <span style={{ color: 'var(--accent-color)' }}>{item.count} enquiries</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--accent-color) 0%, #d97706 100%)',
                          borderRadius: '4px',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Portfolio Status and Conversion Rate */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} style={{ color: 'var(--accent-color)' }} />
                  Conversion Statistics
                </h3>

                {/* Resolution progress meter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '10px 0 20px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '8px solid rgba(16, 185, 129, 0.1)',
                    borderTopColor: 'var(--status-resolved)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: 'var(--status-resolved)'
                  }}>
                    {resolutionRate}%
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Resolution Rate</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                      Percentage of client enquiries successfully contacted and resolved.
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio count info */}
              <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={16} />
                  Portfolio Status
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-color)' }}>{totalProjects}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Total</div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--status-resolved)' }}>{completedProjects}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Completed</div>
                  </div>
                  <div style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--status-inprogress)' }}>{inProgressProjects}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>In Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Recent Enquiries Table & Project Categories */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '30px'
          }} className="crm-bottom-grid">
            
            {/* Recent Enquiries Feed */}
            <div className="glass-panel" style={{ padding: '28px', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ color: 'var(--accent-color)' }} />
                Recent Activity Log
              </h3>

              {enquiries.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', padding: '10px' }}>No activity yet.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '8px 4px' }}>Name</th>
                      <th style={{ padding: '8px 4px' }}>Service</th>
                      <th style={{ padding: '8px 4px' }}>Date</th>
                      <th style={{ padding: '8px 4px', textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.slice(0, 5).map((enq) => (
                      <tr key={enq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '10px 4px', fontWeight: 600, color: 'var(--text-primary)' }}>{enq.name}</td>
                        <td style={{ padding: '10px 4px', color: 'var(--text-secondary)' }}>{enq.project_type}</td>
                        <td style={{ padding: '10px 4px', color: 'var(--text-secondary)' }}>{new Date(enq.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '10px 4px', textAlign: 'right' }}>
                          <span style={{
                            background:
                              enq.status === 'New' ? 'rgba(59, 130, 246, 0.15)' :
                              enq.status === 'Contacted' ? 'rgba(245, 158, 11, 0.15)' :
                              enq.status === 'In Progress' ? 'rgba(139, 92, 246, 0.15)' :
                              'rgba(16, 185, 129, 0.15)',
                            color:
                              enq.status === 'New' ? 'var(--status-new)' :
                              enq.status === 'Contacted' ? 'var(--status-contacted)' :
                              enq.status === 'In Progress' ? 'var(--status-inprogress)' :
                              'var(--status-resolved)',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            {enq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Projects Category Graph */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} style={{ color: 'var(--accent-color)' }} />
                Portfolio Segments
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { name: 'Residential Portfolio', count: projResidential, color: '#3b82f6' },
                  { name: 'Commercial Portfolio', count: projCommercial, color: '#f59e0b' },
                  { name: 'Interior Designs', count: projInterior, color: '#8b5cf6' }
                ].map((item) => {
                  const percent = maxProjectCatCount ? (item.count / maxProjectCatCount) * 100 : 0;
                  return (
                    <div key={item.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                        <span style={{ color: item.color }}>{item.count} items</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${percent}%`,
                          height: '100%',
                          backgroundColor: item.color,
                          borderRadius: '4px',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ENQUIRIES PANEL */}
      {activeTab === 'enquiries' && (
        <div>
          {loading && enquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading entries...</div>
          ) : enquiries.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No enquiries submitted yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {enquiries.map((enq) => (
                <div key={enq.id} className="glass-panel" style={{
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 300px',
                  gap: '24px',
                }} className="enquiry-row">
                  {/* Left Column - Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: '18px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                        {enq.name}
                      </h4>
                      <span style={{
                        background: 'var(--navy-blue)',
                        color: '#fff',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: 600
                      }}>
                        {enq.project_type}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Date: {new Date(enq.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <b>Phone:</b> <a href={`tel:${enq.phone}`} className="communication-link" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{enq.phone}</a> {enq.email && <span> | <b>Email:</b> <a href={`mailto:${enq.email}`} className="communication-link" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{enq.email}</a></span>}
                    </div>

                    <div style={{
                      background: 'rgba(0,0,0,0.02)',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      lineHeight: '1.5',
                      borderLeft: '3px solid var(--card-border)'
                    }} className="message-box">
                      {enq.message}
                    </div>
                  </div>

                  {/* Right Column - Status & Notes */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    borderLeft: '1px solid var(--card-border)',
                    paddingLeft: '24px'
                  }} className="enquiry-actions">
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Status</label>
                      <select
                        value={enq.status}
                        onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                        style={{
                          padding: '8px 12px',
                          fontSize: '13px',
                          borderColor:
                            enq.status === 'New' ? 'var(--status-new)' :
                            enq.status === 'Contacted' ? 'var(--status-contacted)' :
                            enq.status === 'In Progress' ? 'var(--status-inprogress)' :
                            'var(--status-resolved)'
                        }}
                      >
                        <option value="New">🔵 New</option>
                        <option value="Contacted">🟡 Contacted</option>
                        <option value="In Progress">🟣 In Progress</option>
                        <option value="Resolved">🟢 Resolved</option>
                      </select>

                      {enq.status === 'Resolved' && (
                        <button
                          onClick={() => handleDeleteEnquiry(enq.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            marginTop: '10px',
                            width: '100%',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Trash2 size={14} />
                          Delete Enquiry
                        </button>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Admin Notes</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <textarea
                          value={editingNotes[enq.id] || ''}
                          onChange={(e) => handleNotesChange(enq.id, e.target.value)}
                          placeholder="Add comments here..."
                          rows={2}
                          style={{ padding: '8px 12px', fontSize: '12px', resize: 'vertical' }}
                        />
                        <button
                          onClick={() => updateEnquiryStatus(enq.id, enq.status)}
                          style={{
                            background: 'var(--navy-blue)',
                            color: '#fff',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Save notes"
                        >
                          <Save size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. PROJECTS PANEL */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }} className="project-panel-grid">
          {/* List of projects */}
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
              Active Project Listings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {projects.map((p) => (
                <div key={p.id} className="glass-panel" style={{
                  padding: '16px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center'
                }}>
                  <img
                    src={p.image_url}
                    alt={p.title}
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '10px', marginTop: '2px' }}>
                      <span>Category: <b>{p.category}</b></span>
                      <span>Year: <b>{p.year}</b></span>
                      <span>Status: <b>{p.status}</b></span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid #ef4444',
                      color: '#ef4444',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add project form */}
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={18} />
              Add New Project
            </h3>
            <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Project Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Royal duplex"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Project specifications..."
                  rows={3}
                  required
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    required
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Interior">Interior</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    required
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Build Year</label>
                  <input
                    type="number"
                    value={newProject.year}
                    onChange={(e) => setNewProject({ ...newProject, year: parseInt(e.target.value) })}
                    min="1990"
                    max="2050"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Project Image
                </label>
                
                {/* Source Selection Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  marginBottom: '10px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  padding: '4px',
                  borderRadius: '8px',
                  width: 'fit-content',
                  border: '1px solid var(--card-border)'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setImageSourceType('url');
                      setNewProject({ ...newProject, image_url: '' });
                    }}
                    style={{
                      background: imageSourceType === 'url' ? 'var(--accent-color)' : 'none',
                      color: imageSourceType === 'url' ? '#0a192f' : 'var(--text-primary)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Image Link / URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageSourceType('file');
                      setNewProject({ ...newProject, image_url: '' });
                    }}
                    style={{
                      background: imageSourceType === 'file' ? 'var(--accent-color)' : 'none',
                      color: imageSourceType === 'file' ? '#0a192f' : 'var(--text-primary)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Upload from Device
                  </button>
                </div>

                {imageSourceType === 'url' ? (
                  <input
                    type="url"
                    value={newProject.image_url}
                    onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    required
                    style={{ fontSize: '13px' }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required={!newProject.image_url}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        border: '1px dashed var(--card-border)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        borderRadius: '8px'
                      }}
                    />
                    {newProject.image_url && newProject.image_url.startsWith('data:image') && (
                      <div style={{
                        position: 'relative',
                        width: '120px',
                        height: '90px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '2px solid var(--accent-color)',
                        marginTop: '4px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      }}>
                        <img
                          src={newProject.image_url}
                          alt="Upload Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => setNewProject({ ...newProject, image_url: '' })}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '10px' }}>
                {loading ? 'Adding...' : 'Add Project'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. REVIEWS PANEL */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }} className="project-panel-grid">
          {/* List of Reviews */}
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
              Active Google Reviews Listing
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.length === 0 ? (
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No reviews in the database. Add one on the right side.
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="glass-panel" style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'var(--navy-blue)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '13px'
                        }}>
                          {r.author_name ? r.author_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.author_name}</h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{r.relative_time_description} • {r.source || 'Google'}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} fill={s <= r.rating ? '#FBBC05' : 'none'} color="#FBBC05" />
                        ))}
                      </div>
                    </div>

                    <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      "{r.text}"
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px', borderTop: '1px solid var(--card-border)', paddingTop: '10px' }}>
                      <button
                        onClick={() => handleEditReviewSelect(r)}
                        style={{
                          background: 'rgba(59, 130, 246, 0.08)',
                          border: '1px solid var(--status-new)',
                          color: 'var(--status-new)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        <Edit2 size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid #ef4444',
                          color: '#ef4444',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add/Edit Review Form */}
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {editingReviewId ? <Edit2 size={18} /> : <Plus size={18} />}
              {editingReviewId ? 'Edit Google Review' : 'Add Google Review'}
            </h3>
            <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Customer Name</label>
                <input
                  type="text"
                  value={reviewFields.author_name}
                  onChange={(e) => setReviewFields({ ...reviewFields, author_name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Rating (1-5)</label>
                  <select
                    value={reviewFields.rating}
                    onChange={(e) => setReviewFields({ ...reviewFields, rating: parseInt(e.target.value) })}
                    required
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4)</option>
                    <option value={3}>⭐⭐⭐ (3)</option>
                    <option value={2}>⭐⭐ (2)</option>
                    <option value={1}>⭐ (1)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Time Description</label>
                  <input
                    type="text"
                    value={reviewFields.relative_time_description}
                    onChange={(e) => setReviewFields({ ...reviewFields, relative_time_description: e.target.value })}
                    placeholder="e.g. a week ago"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Review Text</label>
                <textarea
                  value={reviewFields.text}
                  onChange={(e) => setReviewFields({ ...reviewFields, text: e.target.value })}
                  placeholder="Paste review content here..."
                  rows={4}
                  required
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Source Platform</label>
                <select
                  value={reviewFields.source}
                  onChange={(e) => setReviewFields({ ...reviewFields, source: e.target.value })}
                  required
                >
                  <option value="Google">Google</option>
                  <option value="Justdial">Justdial</option>
                  <option value="Direct Client">Direct Client</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', flexGrow: 1 }}>
                  {loading ? 'Saving...' : editingReviewId ? 'Update Review' : 'Add Review'}
                </button>
                {editingReviewId && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setEditingReviewId(null);
                      setReviewFields({
                        author_name: '',
                        author_photo_url: '',
                        rating: 5,
                        relative_time_description: 'a week ago',
                        text: '',
                        source: 'Google'
                      });
                    }}
                    style={{ padding: '8px 12px' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. GALLERY PANEL */}
      {activeTab === 'gallery' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }} className="project-panel-grid">
          {/* List of Gallery Items */}
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
              Active Gallery Media ({galleryItems.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {galleryItems.length === 0 ? (
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                  No media in the gallery database. Add one on the right side.
                </div>
              ) : (
                galleryItems.map((item) => (
                  <div key={item.id} className="glass-panel" style={{
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    position: 'relative'
                  }}>
                    <div style={{ height: '110px', width: '100%', borderRadius: '8px', overflow: 'hidden', background: '#000', position: 'relative' }}>
                      {item.media_type === 'image' ? (
                        <img src={item.media_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <video src={item.media_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                      )}
                      <span style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        fontSize: '9px',
                        fontWeight: 700,
                        background: 'rgba(10, 25, 47, 0.85)',
                        color: 'var(--accent-color)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(234, 179, 8, 0.4)'
                      }}>
                        {item.media_type === 'image' ? 'PHOTO' : 'VIDEO'}
                      </span>
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '32px', lineHeight: '1.4' }}>
                        {item.description || 'No description'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteGalleryItem(item.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        width: '100%'
                      }}
                    >
                      <Trash2 size={12} />
                      Delete Media
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Gallery Form */}
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={18} />
              Add Gallery Item
            </h3>
            <form onSubmit={handleAddGalleryItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Media Title</label>
                <input
                  type="text"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  placeholder="e.g. Modern duplex elevation (optional for file uploads)"
                  required={galleryImageSourceType === 'url'}
                />

              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Description</label>
                <textarea
                  value={newGalleryItem.description}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                  placeholder="Short description..."
                  rows={3}
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Type</label>
                  <select
                    value={newGalleryItem.media_type}
                    onChange={(e) => {
                      setNewGalleryItem({ ...newGalleryItem, media_type: e.target.value, media_url: '' });
                    }}
                    required
                  >
                    <option value="image">Photo</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Media Content Source
                </label>
                
                {/* Source Selection Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  marginBottom: '10px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  padding: '4px',
                  borderRadius: '8px',
                  width: 'fit-content',
                  border: '1px solid var(--card-border)'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryImageSourceType('url');
                      setNewGalleryItem({ ...newGalleryItem, media_url: '' });
                    }}
                    style={{
                      background: galleryImageSourceType === 'url' ? 'var(--accent-color)' : 'none',
                      color: galleryImageSourceType === 'url' ? '#0a192f' : 'var(--text-primary)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Link / URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryImageSourceType('file');
                      setNewGalleryItem({ ...newGalleryItem, media_url: '' });
                    }}
                    style={{
                      background: galleryImageSourceType === 'file' ? 'var(--accent-color)' : 'none',
                      color: galleryImageSourceType === 'file' ? '#0a192f' : 'var(--text-primary)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Upload File
                  </button>
                </div>

                {galleryImageSourceType === 'url' ? (
                  <input
                    type="url"
                    value={newGalleryItem.media_url}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, media_url: e.target.value })}
                    placeholder="https://..."
                    required
                    style={{ fontSize: '13px' }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleGalleryFileChange}
                      required={selectedGalleryFiles.length === 0}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        border: '1px dashed var(--card-border)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        borderRadius: '8px'
                      }}
                    />
                    
                    {selectedGalleryFiles.length > 0 && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                        gap: '10px',
                        marginTop: '8px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '8px',
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}>
                        {selectedGalleryFiles.map((item, idx) => (
                          <div key={idx} style={{
                            position: 'relative',
                            height: '80px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: '1px solid var(--card-border)',
                            background: '#000'
                          }}>
                            {item.media_type === 'image' ? (
                              <img src={item.media_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <video src={item.media_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveSelectedFile(idx)}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                zIndex: 10
                              }}
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                )}
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '10px' }}>
                {loading ? 'Adding...' : 'Add to Gallery'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Embedded CSS for responsive elements */}
      <style>{`
        @media (max-width: 992px) {
          .crm-middle-grid,
          .crm-bottom-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 768px) {
          .enquiry-row {
            grid-template-columns: 1fr !important;
          }
          .enquiry-actions {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid var(--card-border);
            padding-top: 16px;
          }
          .project-panel-grid {
            grid-template-columns: 1fr !important;
        }
      `}</style>

      {/* CUSTOM PREMIUM CONFIRMATION DIALOG */}
      {confirmDialog.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          background: 'rgba(2, 12, 27, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '24px'
        }}>
          <div className="glass-panel" style={{
            padding: '30px',
            width: '100%',
            maxWidth: '420px',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                {confirmDialog.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                {confirmDialog.message}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button
                onClick={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null })}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-primary)',
                  padding: '11px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                  setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
                }}
                style={{
                  flex: 1,
                  background: '#ef4444',
                  border: 'none',
                  color: '#fff',
                  padding: '11px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

