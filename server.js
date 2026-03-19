const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

dotenv.config(); // load .env variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Initialize Supabase and Resend clients
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

// ==================== API Routes ====================

// POST /api/subscribe – handle newsletter signups
app.post('/api/subscribe', async (req, res) => {
  const { email, source, pack_weight, timestamp } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    // Insert into Supabase
    const { error: dbError } = await supabase
      .from('subscribers')
      .insert([{
        email,
        source: source || 'website',
        pack_weight: pack_weight || null,
        subscribed_at: timestamp || new Date().toISOString(),
        status: 'active'
      }]);

    if (dbError) {
      if (dbError.code === '23505') { // duplicate email
        return res.status(409).json({ error: 'Email already subscribed' });
      }
      throw dbError;
    }

    // Add to Resend audience
    await resend.contacts.create({
      email,
      firstName: '',
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID
    });

    // Send welcome email
    await resend.emails.send({
      from: 'TrailReadyGear <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to TrailReady Gear!',
      html: '<p>Hi there, thanks for subscribing! Here\'s your free checklist: <a href="/checklist.pdf">Download</a></p>'
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/contact – handle contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message, timestamp } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await supabase.from('contacts').insert([{
      name,
      email,
      subject: subject || null,
      message,
      created_at: timestamp || new Date().toISOString()
    }]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});