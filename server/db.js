const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initDatabase();
  }
});

function initDatabase() {
  db.serialize(() => {
    // Enquiries Table
    db.run(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        project_type TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'New',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects Table
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT NOT NULL,
        year INTEGER NOT NULL,
        status TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admins Table
    db.run(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, () => {
      // Seed default admin: admin / admin123
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('admin123', salt);
      
      db.run(`
        INSERT OR IGNORE INTO admins (username, password_hash)
        VALUES ('admin', ?)
      `, [hash], (err) => {
        if (err) console.error('Admin seeding failed:', err.message);
      });
    });

    // Seed projects if empty
    db.get('SELECT COUNT(*) as count FROM projects', [], (err, row) => {
      if (err) {
        console.error('Error checking project count:', err.message);
        return;
      }
      if (row.count === 0) {
        seedProjects();
      }
    });

    // Reviews Table
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_name TEXT NOT NULL,
        author_photo_url TEXT,
        rating INTEGER NOT NULL,
        relative_time_description TEXT NOT NULL,
        text TEXT NOT NULL,
        source TEXT DEFAULT 'Google',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, () => {
      // Seed reviews if empty
      db.get('SELECT COUNT(*) as count FROM reviews', [], (err, row) => {
        if (err) {
          console.error('Error checking reviews count:', err.message);
          return;
        }
        if (row.count === 0) {
          seedReviews();
        }
      });
    });
  });
}

function seedProjects() {
  const initialProjects = [
    {
      title: 'Luxury Villa, Dhanvantri Nagar',
      description: 'A modern double-story premium duplex featuring state-of-the-art styling, high ceiling ventilation, and custom premium interiors.',
      category: 'Residential',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      year: 2024,
      status: 'Completed'
    },
    {
      title: 'Commercial Hub, Bilhari',
      description: 'A structural masterpiece serving as a premium office and retail space, constructed with heavy grade earthquake-resistant steel.',
      category: 'Commercial',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      year: 2023,
      status: 'Completed'
    },
    {
      title: 'Modern Apartment Complex, Vijay Nagar',
      description: 'Premium housing units utilizing sustainable insulation, modular kitchens, solar roof cells, and custom landscaping designs.',
      category: 'Residential',
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
      year: 2025,
      status: 'In Progress'
    },
    {
      title: 'Premium Corporate Offices, Civic Center',
      description: 'Ultra-modern interior detailing, soundproof glass panel designs, open floor layout, and smart electrical integration.',
      category: 'Interior',
      image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      year: 2024,
      status: 'Completed'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO projects (title, description, category, image_url, year, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  initialProjects.forEach((p) => {
    stmt.run(p.title, p.description, p.category, p.image_url, p.year, p.status);
  });

  stmt.finalize(() => {
    console.log('Successfully seeded database with initial projects.');
  });
}

function seedReviews() {
  const initialReviews = [
    {
      author_name: 'Amit Verma',
      author_photo_url: '',
      rating: 5,
      relative_time_description: '2 weeks ago',
      text: 'Best civil contractors in Jabalpur. Shri Jinesh Kumar Mehra and his team built our duplex house in Vijay Nagar. Complete transparency in billing and top notch work quality.',
      source: 'Google'
    },
    {
      author_name: 'Priyanshu Sharma',
      author_photo_url: '',
      rating: 5,
      relative_time_description: '1 month ago',
      text: 'Excellent interior design service! They did our modular kitchen and woodwork. The layout is space-saving and looks extremely premium. Highly recommended!',
      source: 'Google'
    },
    {
      author_name: 'Rajesh Patel',
      author_photo_url: '',
      rating: 4,
      relative_time_description: '3 months ago',
      text: 'Professional and reliable builders. They constructed our commercial hub in Bilhari. Heavy grade steel and earthquake resistant foundations. Timely project delivery.',
      source: 'Google'
    },
    {
      author_name: 'Sandeep Mishra',
      author_photo_url: '',
      rating: 5,
      relative_time_description: '5 months ago',
      text: 'Very happy with the elevation design and finishing work. The team is skilled and Jinesh ji is highly experienced. Our villa has become a landmark in Dhanvantri Nagar.',
      source: 'Google'
    },
    {
      author_name: 'Soniya Soni',
      author_photo_url: '',
      rating: 5,
      relative_time_description: '8 months ago',
      text: 'Great experience with JK Construction. They managed everything from map design to slab casting and painting with high efficiency. Worth every rupee!',
      source: 'Google'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO reviews (author_name, author_photo_url, rating, relative_time_description, text, source)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  initialReviews.forEach((r) => {
    stmt.run(r.author_name, r.author_photo_url || null, r.rating, r.relative_time_description, r.text, r.source || 'Google');
  });

  stmt.finalize(() => {
    console.log('Successfully seeded database with initial reviews.');
  });
}

module.exports = {
  db,
  // Helper promises for API use
  all(query, params = []) {
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  get(query, params = []) {
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  run(query, params = []) {
    return new Promise((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
};
