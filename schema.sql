CREATE TABLE subscribers (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    source TEXT,
    pack_weight TEXT,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);
CREATE INDEX idx_subscribers_source ON subscribers(source);
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow inserts from service role" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow selects for authenticated users" ON subscribers FOR SELECT USING (auth.role() = 'authenticated');

CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'new'
);
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow inserts from service role" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for authenticated users" ON contacts FOR SELECT USING (auth.role() = 'authenticated');