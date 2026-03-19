import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const { name, email, subject, message, timestamp } = req.body
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' })

    try {
        await supabase.from('contacts').insert([{ name, email, subject: subject || null, message, created_at: timestamp || new Date().toISOString() }])
        return res.status(200).json({ success: true })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Database error' })
    }
}