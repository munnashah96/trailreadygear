import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const { email, source, pack_weight, timestamp } = req.body
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' })

    try {
        const { error: dbError } = await supabase
            .from('subscribers')
            .insert([{ email, source: source || 'website', pack_weight: pack_weight || null, subscribed_at: timestamp || new Date().toISOString(), status: 'active' }])
        if (dbError) {
            if (dbError.code === '23505') return res.status(409).json({ error: 'Email already subscribed' })
            throw dbError
        }

        await resend.contacts.create({ email, firstName: '', unsubscribed: false, audienceId: process.env.RESEND_AUDIENCE_ID })
        await resend.emails.send({
            from: 'TrailReady Gear <welcome@trailreadygear.com>',
            to: [email],
            subject: 'Welcome to TrailReady Gear!',
            html: '<p>Hi there, thanks for subscribing! Here\'s your free checklist: <a href="/checklist.pdf">Download</a></p>'
        })

        return res.status(200).json({ success: true })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Server error' })
    }
}