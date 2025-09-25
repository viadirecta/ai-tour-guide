-- QR Tour Guide Database Schema
-- PostgreSQL implementation

-- Create custom enums
CREATE TYPE user_role AS ENUM ('admin', 'guide', 'visitor');
CREATE TYPE file_type AS ENUM ('image', 'video');
CREATE TYPE payment_method AS ENUM ('paypal', 'bizum', 'qr_static');
CREATE TYPE tip_status AS ENUM ('pending', 'completed', 'failed');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    role user_role DEFAULT 'visitor' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paypal_email VARCHAR,
    bizum_phone VARCHAR
);

-- Create indexes for users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Create tours table
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR NOT NULL,
    description TEXT,
    city VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    duration_minutes INTEGER,
    kml_file_url VARCHAR,
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    average_rating FLOAT DEFAULT 0.0,
    total_ratings INTEGER DEFAULT 0
);

-- Create indexes for tours
CREATE INDEX idx_tours_guide_id ON tours(guide_id);
CREATE INDEX idx_tours_title ON tours(title);
CREATE INDEX idx_tours_city ON tours(city);
CREATE INDEX idx_tours_country ON tours(country);
CREATE INDEX idx_tours_category ON tours(category);
CREATE INDEX idx_tours_is_published ON tours(is_published);

-- Create points_of_interest table
CREATE TABLE points_of_interest (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description_raw TEXT NOT NULL,
    description_ai_enhanced TEXT,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    qr_code_url VARCHAR UNIQUE,
    order_in_tour INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for points_of_interest
CREATE INDEX idx_poi_tour_id ON points_of_interest(tour_id);
CREATE INDEX idx_poi_coordinates ON points_of_interest(latitude, longitude);

-- Create multimedia table
CREATE TABLE multimedia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poi_id UUID NOT NULL REFERENCES points_of_interest(id) ON DELETE CASCADE,
    file_url VARCHAR NOT NULL,
    file_type file_type NOT NULL,
    caption VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for multimedia
CREATE INDEX idx_multimedia_poi_id ON multimedia(poi_id);

-- Create ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tour_id, user_id)
);

-- Create indexes for ratings
CREATE INDEX idx_ratings_tour_id ON ratings(tour_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);

-- Create tips table
CREATE TABLE tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    giver_user_id UUID REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR' NOT NULL,
    payment_method payment_method NOT NULL,
    transaction_id VARCHAR,
    status tip_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for tips
CREATE INDEX idx_tips_tour_id ON tips(tour_id);
CREATE INDEX idx_tips_giver_user_id ON tips(giver_user_id);
CREATE INDEX idx_tips_status ON tips(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poi_updated_at BEFORE UPDATE ON points_of_interest
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();