/**
 * Utility script to register initial users in the Firebase database
 * This can be used to populate the system with legitimate users for comparison
 */

import fraudDetectionService from '../services/fraudDetectionService';

/**
 * Register a user with their image
 * @param {string} name - User's name
 * @param {File} imageFile - User's image file
 */
export async function registerUser(name, imageFile) {
  try {
    console.log(`Registering user: ${name}`);
    const result = await fraudDetectionService.registerUser(name, imageFile);
    
    if (result.success) {
      console.log(`✓ Successfully registered ${name}`);
      console.log(`  User ID: ${result.userId}`);
      return result;
    } else {
      console.error(`✗ Failed to register ${name}: ${result.error}`);
      return result;
    }
  } catch (error) {
    console.error(`✗ Error registering ${name}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Batch register multiple users
 * @param {Array<{name: string, imageFile: File}>} users
 */
export async function registerMultipleUsers(users) {
  console.log(`Starting batch registration of ${users.length} users...`);
  const results = [];
  
  for (const user of users) {
    const result = await registerUser(user.name, user.imageFile);
    results.push({ ...user, ...result });
    
    // Wait a bit between registrations to avoid overwhelming Firebase
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\nRegistration complete:`);
  console.log(`  ✓ Successful: ${successful}`);
  console.log(`  ✗ Failed: ${failed}`);
  
  return results;
}

// Example usage (can be called from browser console):
// import { registerUser } from './utils/setupUsers';
// const imageInput = document.querySelector('input[type="file"]');
// imageInput.addEventListener('change', async (e) => {
//   await registerUser('John Doe', e.target.files[0]);
// });
