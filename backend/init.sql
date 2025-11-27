-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  class VARCHAR(100),
  nationality VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, class, nationality) VALUES
  ('John Doe', 'A', 'USA'),
  ('Jane Smith', 'B', 'UK'),
  ('Carlos Garcia', 'A', 'Spain'),
  ('Maria Silva', 'C', 'Brazil'),
  ('Ahmed Hassan', 'B', 'Egypt');
