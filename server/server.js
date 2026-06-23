const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'jk_construction_super_secret_key_123';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token expired or invalid' });
    }
    req.user = user;
    next();
  });
}

// PUBLIC ENDPOINTS

// Get projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.all('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await db.all('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Submit enquiry
app.post('/api/enquiries', async (req, res) => {
  const { name, email, phone, project_type, message } = req.body;
  if (!name || !phone || !project_type || !message) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    const result = await db.run(
      `INSERT INTO enquiries (name, email, phone, project_type, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email || null, phone, project_type, message]
    );
    res.status(201).json({ message: 'Enquiry submitted successfully', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const admin = await db.get('SELECT * FROM admins WHERE username = ?', [username]);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = bcrypt.compareSync(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: 'Login process failed' });
  }
});


// PROTECTED ADMIN ENDPOINTS

// Get all enquiries
app.get('/api/admin/enquiries', authenticateToken, async (req, res) => {
  try {
    const enquiries = await db.all('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// Update enquiry status and notes
app.put('/api/admin/enquiries/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    await db.run(
      'UPDATE enquiries SET status = ?, notes = ? WHERE id = ?',
      [status, notes || null, id]
    );
    res.json({ message: 'Enquiry updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// Create new project
app.post('/api/admin/projects', authenticateToken, async (req, res) => {
  const { title, description, category, image_url, year, status } = req.body;
  if (!title || !description || !category || !image_url || !year || !status) {
    return res.status(400).json({ error: 'All project fields are required' });
  }

  try {
    const result = await db.run(
      `INSERT INTO projects (title, description, category, image_url, year, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, category, image_url, parseInt(year), status]
    );
    res.status(201).json({ message: 'Project created successfully', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// Delete project
app.delete('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Delete enquiry
app.delete('/api/admin/enquiries/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM enquiries WHERE id = ?', [id]);
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

// Add new review
app.post('/api/admin/reviews', authenticateToken, async (req, res) => {
  const { author_name, author_photo_url, rating, relative_time_description, text, source } = req.body;
  if (!author_name || !rating || !relative_time_description || !text) {
    return res.status(400).json({ error: 'Required review fields are missing' });
  }

  try {
    const result = await db.run(
      `INSERT INTO reviews (author_name, author_photo_url, rating, relative_time_description, text, source)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [author_name, author_photo_url || null, parseInt(rating), relative_time_description, text, source || 'Google']
    );
    res.status(201).json({ message: 'Review created successfully', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Update review
app.put('/api/admin/reviews/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { author_name, author_photo_url, rating, relative_time_description, text, source } = req.body;

  if (!author_name || !rating || !relative_time_description || !text) {
    return res.status(400).json({ error: 'Required review fields are missing' });
  }

  try {
    await db.run(
      `UPDATE reviews 
       SET author_name = ?, author_photo_url = ?, rating = ?, relative_time_description = ?, text = ?, source = ?
       WHERE id = ?`,
      [author_name, author_photo_url || null, parseInt(rating), relative_time_description, text, source || 'Google', id]
    );
    res.json({ message: 'Review updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete review
app.delete('/api/admin/reviews/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// AI Chatbot API connecting to Gemini
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return res.json({
      reply: 'Namaste! Main abhi configuration stage mein hoon. Please ask the developer to configure the GEMINI_API_KEY in the environment file.'
    });
  }

  const SYSTEM_PROMPT = `You are the friendly, helpful, and professional AI Assistant for JK Construction, Jabalpur (M.P.).
Founder: Shri Jinesh Kumar Mehra (Founded in 2010).
Office Location: Dhanvantri Nagar & Bilhari, Jabalpur, MP.
Services Offered:
1. Civil Construction (duplex/villas/commercial)
2. House Renovation & Repairs
3. Interior Designing (modular kitchens/woodwork)
4. Architecture & Map Designing
5. Property Consultancy

Contacts:
- Call / WhatsApp: +91-7692931715, +91-9171466180
- Email: jkc@jkconstructionjbp.com

Interaction rules:
- CRITICAL: Keep answers extremely short, concise, and sweet (maximum 1-2 lines or sentences). No long paragraphs.
- Talk like a friendly human helper using a natural blend of Hindi and English (Hinglish).

PROACTIVE LEAD COLLECTION - MOST IMPORTANT RULE:
When a user shows ANY interest in a service (e.g., "ghar banana hai", "interior chahiye", "renovation", "map banana hai", etc.), you MUST proactively and conversationally collect the following details ONE BY ONE in a natural friendly way — do NOT ask all at once:
  Step 1: If name not known → Ask their name first. (e.g., "Bilkul! Aapka naam kya hai?")
  Step 2: If phone not known → Ask contact number. (e.g., "Aur aapka contact number kya hai jisse hamare team aapse baat kar sake?")
  Step 3: If location not known → Ask project location. (e.g., "Project kahan banana hai? Location batayein.")
  Step 4: If budget not known → Ask budget. (e.g., "Aur aapka approximate budget kya hai?")
  Step 5: Once all 4 details collected → Thank them warmly and tell them our team will contact them soon, and also suggest WhatsApp at +91-7692931715.
- Track what has already been shared in the conversation history and DO NOT ask for details that have already been provided.
- If user directly provides all details in one message, skip the steps and go to Step 5.

LEAD CAPTURE RULE:
If the user provides any requirements, budget, desired location, contact phone number, or expresses an interest to construct/renovate/design, you MUST append a hidden JSON tag at the very end of your reply in this exact format:
<LEAD_JSON>{"budget": "extracted budget or null", "location": "extracted location or null", "requirements": "brief description of what user wants to build or renovate or design", "phone": "extracted phone number or null", "name": "extracted client name or null", "project_type": "Civil Construction | House Renovation | Interior Designing | Architecture & Map Designing | Property Consultancy"}</LEAD_JSON>
Never talk about this tag or tell the user about it; simply append it quietly at the very end of your response text.`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `System Instruction: ${SYSTEM_PROMPT}` }]
    },
    {
      role: 'model',
      parts: [{ text: "Understood. I will act as the JK Construction AI Assistant under these rules." }]
    }
  ];

  if (history && Array.isArray(history)) {
    history.forEach(h => {
      if (h.text) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contents })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mafi chahta hoon, main aapko sun nahi pa raha hoon. Kripya dobara likhein ya +91-7692931715 par call karein.";
    
    // Check and parse hidden LEAD_JSON block
    const leadRegex = /<LEAD_JSON>([\s\S]*?)<\/LEAD_JSON>/i;
    const match = replyText.match(leadRegex);
    
    if (match) {
      const jsonStr = match[1].trim();
      // Remove lead JSON tag from the user reply
      replyText = replyText.replace(leadRegex, '').trim();
      
      try {
        const leadData = JSON.parse(jsonStr);
        // Only save if some details are detected
        if (leadData.requirements || leadData.budget || leadData.location || leadData.phone) {
          const leadName = leadData.name && leadData.name !== 'null' ? leadData.name : 'Chatbot Lead';
          const leadPhone = leadData.phone && leadData.phone !== 'null' ? leadData.phone : 'Via Chatbot';
          const leadProjType = leadData.project_type && leadData.project_type !== 'null' ? leadData.project_type : 'Civil Construction';
          
          let detailedMsg = `Captured automatically by AI Chatbot.`;
          if (leadData.requirements && leadData.requirements !== 'null') {
            detailedMsg += `\nRequirements: ${leadData.requirements}`;
          }
          if (leadData.budget && leadData.budget !== 'null') {
            detailedMsg += `\nBudget: ${leadData.budget}`;
          }
          if (leadData.location && leadData.location !== 'null') {
            detailedMsg += `\nLocation: ${leadData.location}`;
          }
          if (leadData.name && leadData.name !== 'null') {
            detailedMsg += `\nCustomer Name: ${leadData.name}`;
          }

          await db.run(
            `INSERT INTO enquiries (name, email, phone, project_type, message, status, notes)
             VALUES (?, ?, ?, ?, ?, 'New', 'Automatically captured via AI Chatbot')`,
            [leadName, null, leadPhone, leadProjType, detailedMsg]
          );
          console.log('Automatically saved chatbot lead to database:', leadData);
        }
      } catch (jsonErr) {
        console.error('Failed to parse chatbot lead JSON:', jsonErr.message, 'Raw string:', jsonStr);
      }
    }

    res.json({ reply: replyText });
  } catch (err) {
    console.error('Gemini integration error:', err.message);
    res.status(500).json({ error: 'Failed to communicate with AI' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
