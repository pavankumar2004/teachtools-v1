import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the subscriber type
export type Subscriber = {
  id: string;
  email: string;
  source?: string;
  userGroup?: string;
  isVerified: boolean;
  verificationToken?: string;
  createdAt: string;
  updatedAt: string;
};

// Simple file-based storage for subscribers
// In production, you would use a proper database
const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

// Ensure the data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2));
  }
}

// Get all subscribers
export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    ensureDataDir();
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data) as Subscriber[];
  } catch (error) {
    console.error('Error reading subscribers:', error);
    return [];
  }
}

// Add a new subscriber
export async function addSubscriber(email: string, source?: string, userGroup?: string): Promise<Subscriber> {
  try {
    ensureDataDir();
    
    // Get existing subscribers
    const subscribers = await getSubscribers();
    
    // Check if email already exists
    const existingSubscriber = subscribers.find(sub => sub.email === email);
    if (existingSubscriber) {
      return existingSubscriber;
    }
    
    // Create new subscriber
    const newSubscriber: Subscriber = {
      id: uuidv4(),
      email,
      source,
      userGroup,
      isVerified: false,
      verificationToken: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to list and save
    subscribers.push(newSubscriber);
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    
    return newSubscriber;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw new Error('Failed to add subscriber');
  }
}

// Verify a subscriber
export async function verifySubscriber(token: string): Promise<boolean> {
  try {
    ensureDataDir();
    
    // Get existing subscribers
    const subscribers = await getSubscribers();
    
    // Find subscriber with matching token
    const index = subscribers.findIndex(sub => sub.verificationToken === token);
    if (index === -1) {
      return false;
    }
    
    // Update subscriber
    subscribers[index].isVerified = true;
    subscribers[index].verificationToken = undefined;
    subscribers[index].updatedAt = new Date().toISOString();
    
    // Save changes
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error verifying subscriber:', error);
    return false;
  }
}

// Remove a subscriber
export async function removeSubscriber(id: string): Promise<boolean> {
  try {
    ensureDataDir();
    
    // Get existing subscribers
    const subscribers = await getSubscribers();
    
    // Filter out the subscriber to remove
    const updatedSubscribers = subscribers.filter(sub => sub.id !== id);
    
    // If no change in length, subscriber wasn't found
    if (updatedSubscribers.length === subscribers.length) {
      return false;
    }
    
    // Save changes
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(updatedSubscribers, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error removing subscriber:', error);
    return false;
  }
}
